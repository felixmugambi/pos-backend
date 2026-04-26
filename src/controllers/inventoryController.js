import { supabase } from '../config/supabaseClient.js';

// GET INVENTORY
export const getInventory = async (req, res) => {
  const { data, error } = await supabase
    .from('inventory')
    .select('*, products(*)');

  if (error) return res.status(400).json({ error: error.message });

  res.json(data);
};

// RESTOCK
export const restockProduct = async (req, res) => {
  const { product_id, quantity } = req.body;

  const { error } = await supabase.rpc('increment_stock', {
    p_product_id: product_id,
    p_quantity: quantity
  });

  if (error) return res.status(400).json({ error: error.message });

  res.json({ message: 'Stock updated' });
};