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


export const adjustStock = async (req, res) => {
  const { product_id, new_quantity } = req.body;

  try {
    // 1. get current stock
    const { data: current, error: fetchError } = await supabase
      .from("inventory")
      .select("quantity")
      .eq("product_id", product_id)
      .single();

    if (fetchError) throw fetchError;

    const diff = new_quantity - current.quantity;

    // 2. apply difference
    const { error } = await supabase.rpc("increment_stock", {
      p_product_id: product_id,
      p_quantity: diff,
    });

    if (error) throw error;

    res.json({ message: "Stock adjusted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};