import { supabase } from '../config/supabaseClient.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// REGISTER USER (admin creates staff)
export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          name,
          email,
          password_hash: hashedPassword,
          role: role || 'cashier'
        }
      ])
      .select();

    if (error) throw error;

    res.json({ message: 'User created', user: data });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// LOGIN
export const login = async (req, res) => {

  console.log("LOGIN HIT");
  console.log("JWT SECRET:", process.env.JWT_SECRET);
  const { email, password } = req.body;

  try {
    // get user
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, data.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // generate token
    const token = jwt.sign(
      {
        id: data.id,
        role: data.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: {
        id: data.id,
        name: data.name,
        role: data.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUsers = async (req, res) => {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, role, created_at');

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json({ users: data });
};

// GET CURRENT USER
export const getMe = async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, role')
        .eq('id', req.user.id)
        .single();
  
      if (error) throw error;
  
      res.json({
        user: data
      });
  
    } catch (err) {
      res.status(400).json({
        error: err.message
      });
    }
  };