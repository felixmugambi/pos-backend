import { supabase } from "../config/supabaseClient.js";

const attachImages = (products, dbImages) => {
  return products.map((p) => ({
    ...p,
    product_images: dbImages.filter((img) => img.product_id === p.id),
  }));
};

// CREATE PRODUCT
export const createProduct = async (req, res) => {
  const {
    name,
    barcode,
    category_id,
    buying_price,
    selling_price,
    images: imageUrls = [], // ✅ SAFE NAME
  } = req.body;

  try {
    // 1. create product
    const { data: product, error: productError } = await supabase
      .from("products")
      .insert([
        {
          name,
          barcode,
          category_id,
          buying_price,
          selling_price,
        },
      ])
      .select("*")
      .single();

    if (productError) {
      if (productError.code === "23505") {
        return res.status(400).json({
          success: false,
          error: "A product with this barcode already exists",
        });
      }
      throw productError;
    }

    // 2. insert images
    if (imageUrls.length > 0) {
      const imageRows = imageUrls.map((url) => ({
        product_id: product.id,
        image_url: url,
      }));

      const { error: imgError } = await supabase
        .from("product_images")
        .insert(imageRows);

      if (imgError) throw imgError;
    }

    // 3. fetch images
    const { data: dbImages } = await supabase
      .from("product_images")
      .select("product_id, image_url")
      .eq("product_id", product.id);

    const fullProduct = {
      ...product,
      product_images: dbImages || [],
    };

    res.json({
      success: true,
      product: fullProduct,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

// GET PRODUCTS
export const getProducts = async (req, res) => {
  try {
    const { data: products, error: prodError } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (prodError) throw prodError;

    const { data: dbImages, error: imgError } = await supabase
      .from("product_images")
      .select("product_id, image_url");

    if (imgError) throw imgError;

    const result = attachImages(products, dbImages);

    res.json({
      success: true,
      products: result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

// SEARCH PRODUCTS
export const searchProducts = async (req, res) => {
  const { q, include_inactive } = req.query;

  try {
    let query = supabase
      .from("products")
      .select("*")
      .or(`name.ilike.%${q}%,barcode.eq.${q}`)
      .limit(15);

    if (!include_inactive) {
      query = query.eq("is_active", true);
    }

    const { data: products, error: prodError } = await query;
    if (prodError) throw prodError;

    const { data: dbImages, error: imgError } = await supabase
      .from("product_images")
      .select("product_id, image_url");

    if (imgError) throw imgError;

    const result = attachImages(products, dbImages);

    res.json({
      success: true,
      products: result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  const { id } = req.params;

  const {
    name,
    barcode,
    category_id,
    buying_price,
    selling_price,
    images: imageUrls = [], // ✅ SAFE NAME
  } = req.body;

  try {
    const { data: product, error } = await supabase
      .from("products")
      .update({
        name,
        barcode,
        category_id,
        buying_price,
        selling_price,
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;

    if (imageUrls.length > 0) {
      await supabase.from("product_images").delete().eq("product_id", id);

      const imageRows = imageUrls.map((url) => ({
        product_id: id,
        image_url: url,
      }));

      await supabase.from("product_images").insert(imageRows);
    }

    const { data: dbImages } = await supabase
      .from("product_images")
      .select("product_id, image_url")
      .eq("product_id", id);

    const fullProduct = {
      ...product,
      product_images: dbImages || [],
    };

    res.json({
      success: true,
      product: fullProduct,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from("products")
      .update({ is_active: false })
      .eq("id", id);

    if (error) throw error;

    res.json({
      success: true,
      message: "Product deactivated",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

export const getProductByBarcode = async (req, res) => {
  const { barcode } = req.params;

  try {
    const { data: product, error } = await supabase
      .from("products")
      .select("*")
      .eq("barcode", barcode)
      .eq("is_active", true)
      .single();

    if (error || !product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    const { data: dbImages } = await supabase
      .from("product_images")
      .select("product_id, image_url")
      .eq("product_id", product.id);

    res.json({
      success: true,
      product: {
        ...product,
        product_images: dbImages || [],
      },
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};