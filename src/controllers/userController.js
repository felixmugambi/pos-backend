import { supabase } from '../config/supabaseClient.js';

export const getUsers = async (req, res) => {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, role, created_at');

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json({ users: data });
};