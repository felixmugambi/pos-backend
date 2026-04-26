import { supabase } from '../config/supabaseClient.js';

// CREATE CATEGORY
export const createCategory = async (req, res) => {
  const { name } = req.body;

  try {
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name }])
      .select();

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET ALL CATEGORIES
export const getCategories = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// UPDATE CATEGORY
export const updateCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('categories')
      .update(req.body)
      .eq('id', id)
      .select();

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE CATEGORY (safe check)
export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if category is used
    const { data: products } = await supabase
      .from('products')
      .select('id')
      .eq('category_id', id);

    if (products.length > 0) {
      return res.status(400).json({
        error: 'Cannot delete category with assigned products'
      });
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};