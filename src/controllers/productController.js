import { supabase } from '../config/supabaseClient.js';

// CREATE PRODUCT
export const createProduct = async (req, res) => {
  const { name, barcode, category_id, buying_price, selling_price } = req.body;

  try {
    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          name,
          barcode,
          category_id,
          buying_price,
          selling_price
        }
      ])
      .select(`
        *,
        categories(name)
      `);

      if (error) {
        // HANDLE UNIQUE CONSTRAINT ERROR
        if (error.code === '23505') {
          return res.status(400).json({
            success: false,
            error: "A product with this barcode already exists"
          });
        }
  
        throw error;
      }

    res.json({
      success: true,
      product: data[0]
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// GET PRODUCTS
export const getProducts = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories(name)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      products: data
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// SEARCH PRODUCTS
export const searchProducts = async (req, res) => {
  const { q, include_inactive } = req.query;

  try {
    let query = supabase
      .from('products')
      .select(`
        *,
        categories(name)
      `)
      .or(`name.ilike.%${q}%,barcode.eq.${q}`)
      .limit(15);

    // Only filter if not explicitly requesting inactive
    if (!include_inactive) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json({
      success: true,
      products: data
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('products')
      .update(req.body)
      .eq('id', id)
      .select(`
        *,
        categories(name)
      `);

    if (error) throw error;

    res.json({
      success: true,
      product: data[0]
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// SOFT DELETE
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('products')
      .update({ is_active: false })
      .eq('id', id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Product deactivated'
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};