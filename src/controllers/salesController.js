import { supabase } from '../config/supabaseClient.js';

export const createSale = async (req, res) => {
  const { items, payment_method } = req.body;
  const user_id = req.user.id; // from token

  try {
    const { data, error } = await supabase.rpc('create_sale_transaction', {
      p_items: items,
      p_payment_method: payment_method,
      p_user_id: user_id
    });

    if (error) throw error;

    res.json({
      success: true,
      sale: data
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

export const getSales = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('sales')
      .select(`
        *,
        users(name),
        sale_items(
          quantity,
          price_at_sale,
          products(name)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      sales: data
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

export const getSaleById = async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('sales')
      .select(`
        *,
        users(name),
        sale_items(
          quantity,
          price_at_sale,
          products(name)
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    res.json({
      success: true,
      sale: data
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

export const getSalesByDate = async (req, res) => {
  const { date } = req.query;

  try {
    const { data, error } = await supabase
      .from('sales')
      .select('*')
      .gte('created_at', `${date} 00:00:00`)
      .lte('created_at', `${date} 23:59:59`);

    if (error) throw error;

    res.json({
      success: true,
      sales: data
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};


export const getSalesSummary = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('sales')
      .select('total_amount');

    if (error) throw error;

    const total = data.reduce((sum, s) => sum + Number(s.total_amount), 0);

    res.json({
      success: true,
      total_sales: total
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};


