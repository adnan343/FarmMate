'use client';

import ConfirmDialog from '@/app/components/ConfirmDialog';
import { useToast } from '@/app/components/ToastProvider';
import { DollarSign, Edit, Eye, EyeOff, Package, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getFarmerOwnProducts, updateProduct, deleteProduct, toggleProductAvailability } from '@/lib/api';

export default function MyProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'vegetables',
    stock: '',
    unit: 'kg'
  });
  const toast = useToast();

  useEffect(() => {
    // Get user data from cookies
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    };

    const userId = getCookie('userId');
    const userName = getCookie('userName');
    const userEmail = getCookie('userEmail');
    const role = getCookie('role');

    if (userId) {
      const userData = {
        _id: userId,
        name: userName,
        email: userEmail,
        role: role
      };
      setUser(userData);
      fetchProducts(userId);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProducts = async (farmerId) => {
    try {
      const data = await getFarmerOwnProducts(farmerId);
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setEditForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      unit: product.unit
    });
    setShowEditModal(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const data = await updateProduct(selectedProduct._id, {
        ...editForm,
        price: parseFloat(editForm.price),
        stock: parseInt(editForm.stock)
      });
      if (data.success) {
        setProducts(products.map(p => p._id === selectedProduct._id ? data.data : p));
        setShowEditModal(false);
        setSelectedProduct(null);
        toast.success('Product updated');
      } else {
        toast.error(data.msg || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    }
  };

  const handleToggleAvailability = async (productId, currentStatus) => {
    try {
      const data = await toggleProductAvailability(productId);
      if (data.success) {
        setProducts(products.map(p => p._id === productId ? data.data : p));
        toast.success(data.msg || 'Status updated');
      } else {
        toast.error(data.msg || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error toggling product availability:', error);
      toast.error('Failed to update status');
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const data = await deleteProduct(productId);
      if (data.success) {
        setProducts(products.filter(p => p._id !== productId));
        toast.success('Product deleted');
      } else {
        toast.error(data.msg || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };
  const openConfirmDelete = (productId) => setConfirmDeleteId(productId);
  const closeConfirmDelete = () => setConfirmDeleteId(null);
  const confirmDelete = async () => {
    const id = confirmDeleteId;
    closeConfirmDelete();
    if (id) await handleDeleteProduct(id);
  };

  const getCategoryColor = (category) => {
    const colors = {
      vegetables: 'bg-green-100 text-green-800',
      fruits: 'bg-orange-100 text-orange-800',
      grains: 'bg-yellow-100 text-yellow-800',
      dairy: 'bg-blue-100 text-blue-800',
      meat: 'bg-red-100 text-red-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Package className="w-4 h-4" />
          <span>{products.length} products</span>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg">{product.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{product.description}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(product.category)}`}>
                {product.category}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Price:</span>
                <span className="font-semibold text-gray-900">
                  ${product.price > 0 ? product.price.toFixed(2) : 'Not set'} / {product.unit}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Stock:</span>
                <span className="font-semibold text-gray-900">{product.stock} {product.unit}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Status:</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  product.isAvailable 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {product.isAvailable ? 'Published' : 'Draft'}
                </span>
              </div>
              {product.farm && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Farm:</span>
                  <span className="text-sm text-gray-900">{product.farm.name}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleEditProduct(product)}
                className="flex-1 bg-teal-600 text-white px-3 py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm flex items-center justify-center gap-1"
              >
                <Edit className="w-3 h-3" />
                Edit
              </button>
              <button
                onClick={() => handleToggleAvailability(product._id, product.isAvailable)}
                className={`flex-1 px-3 py-2 rounded-lg transition-colors text-sm flex items-center justify-center gap-1 ${
                  product.isAvailable
                    ? 'bg-orange-600 text-white hover:bg-orange-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {product.isAvailable ? (
                  <>
                    <EyeOff className="w-3 h-3" />
                    Unpublish
                  </>
                ) : (
                  <>
                    <Eye className="w-3 h-3" />
                    Publish
                  </>
                )}
              </button>
              <button
                onClick={() => openConfirmDelete(product._id)}
                className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
          <p className="text-gray-500">
            Harvest your crops to automatically create products here. You can then edit and publish them to the marketplace.
          </p>
        </div>
      )}

      {/* Edit Product Modal */}
                      {showEditModal && selectedProduct && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowEditModal(false)} />
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  rows="3"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      step="0.01"
                      value={editForm.price}
                      onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                      className="w-full border rounded-lg pl-10 pr-3 py-2"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    value={editForm.stock}
                    onChange={(e) => setEditForm({...editForm, stock: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="vegetables">Vegetables</option>
                    <option value="fruits">Fruits</option>
                    <option value="grains">Grains</option>
                    <option value="dairy">Dairy</option>
                    <option value="meat">Meat</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <select
                    value={editForm.unit}
                    onChange={(e) => setEditForm({...editForm, unit: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="kg">kg</option>
                    <option value="lb">lb</option>
                    <option value="piece">piece</option>
                    <option value="dozen">dozen</option>
                    <option value="bundle">bundle</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700"
                >
                  Update Product
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete product confirmation */}
      <ConfirmDialog
        open={!!confirmDeleteId}
        title="Delete product?"
        description="This will permanently remove the product."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={closeConfirmDelete}
      />
    </div>
  );
} 