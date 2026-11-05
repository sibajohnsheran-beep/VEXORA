
import { useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import {
  Package,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  ImagePlus,
  Save,
  CheckCircle2,
  AlertTriangle,
  Boxes,
  Eye,
  EyeOff,
  RotateCcw,
  Info,
} from 'lucide-react'

import './Products.css'

type ProductCategory =
  | 'PTZ Camera'
  | 'Dome Camera'
  | 'Bullet Camera'
  | 'IP Camera'
  | 'NVR / DVR'
  | 'Accessories'
  | 'Other'

type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock'
type ToastType = 'success' | 'error' | 'warning' | 'info'

type Product = {
  id: string
  name: string
  category: ProductCategory
  price: number
  stock: number
  description: string
  image: string
  featured: boolean
  published: boolean
  createdAt: string
}

type ProductForm = Omit<Product, 'id' | 'createdAt'>

type FormErrors = Partial<
  Record<'name' | 'price' | 'stock' | 'image', string>
>

type Toast = {
  id: number
  type: ToastType
  title: string
  message: string
}

const STORAGE_KEY = 'vexora_admin_products_v1'
const MAX_IMAGE_SIZE = 350 * 1024

const categories: ProductCategory[] = [
  'PTZ Camera',
  'Dome Camera',
  'Bullet Camera',
  'IP Camera',
  'NVR / DVR',
  'Accessories',
  'Other',
]

const initialProducts: Product[] = [
  {
    id: 'VX-P001',
    name: 'VEXORA AI PTZ Camera',
    category: 'PTZ Camera',
    price: 125000,
    stock: 18,
    description: 'Intelligent PTZ surveillance camera with smart tracking.',
    image: '',
    featured: true,
    published: true,
    createdAt: '2026-11-01',
  },
  {
    id: 'VX-P002',
    name: 'VEXORA Smart Dome Camera',
    category: 'Dome Camera',
    price: 55000,
    stock: 32,
    description: 'Compact dome camera for indoor security monitoring.',
    image: '',
    featured: true,
    published: true,
    createdAt: '2026-11-01',
  },
  {
    id: 'VX-P003',
    name: 'VEXORA Bullet Camera',
    category: 'Bullet Camera',
    price: 48000,
    stock: 25,
    description: 'Weather-resistant camera for outdoor surveillance.',
    image: '',
    featured: false,
    published: true,
    createdAt: '2026-11-01',
  },
  {
    id: 'VX-P004',
    name: 'VEXORA 4K IP Camera',
    category: 'IP Camera',
    price: 72000,
    stock: 14,
    description: 'High-resolution network camera with sharp 4K imaging.',
    image: '',
    featured: true,
    published: true,
    createdAt: '2026-11-01',
  },
  {
    id: 'VX-P005',
    name: 'VEXORA Mini Dome',
    category: 'Dome Camera',
    price: 39000,
    stock: 8,
    description: 'Compact camera for offices, shops and indoor spaces.',
    image: '',
    featured: false,
    published: true,
    createdAt: '2026-11-01',
  },
  {
    id: 'VX-P006',
    name: 'VEXORA Night Vision Bullet',
    category: 'Bullet Camera',
    price: 59000,
    stock: 12,
    description: 'Outdoor camera with enhanced night surveillance.',
    image: '',
    featured: false,
    published: true,
    createdAt: '2026-11-01',
  },
  {
    id: 'VX-P007',
    name: 'VEXORA 8-Channel NVR',
    category: 'NVR / DVR',
    price: 95000,
    stock: 5,
    description: 'Network video recorder for multi-camera monitoring.',
    image: '',
    featured: false,
    published: true,
    createdAt: '2026-11-01',
  },
  {
    id: 'VX-P008',
    name: 'VEXORA Wireless IP Camera',
    category: 'IP Camera',
    price: 44000,
    stock: 0,
    description: 'Wireless camera for flexible security installations.',
    image: '',
    featured: false,
    published: false,
    createdAt: '2026-11-01',
  },
]

const emptyForm: ProductForm = {
  name: '',
  category: 'PTZ Camera',
  price: 0,
  stock: 0,
  description: '',
  image: '',
  featured: false,
  published: true,
}

function formatPrice(price: number) {
  return `LKR ${price.toLocaleString('en-LK')}`
}

function getStockStatus(stock: number): StockStatus {
  if (stock === 0) return 'Out of Stock'
  if (stock <= 10) return 'Low Stock'
  return 'In Stock'
}

function createProductId() {
  return `VX-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`
}

function loadProducts(): Product[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)

    if (!stored) return initialProducts

    const parsed: unknown = JSON.parse(stored)

    if (Array.isArray(parsed)) {
      return parsed as Product[]
    }
  } catch (error) {
    console.error('Unable to load saved products:', error)
  }

  return initialProducts
}

function validateProduct(
  form: ProductForm,
  products: Product[],
  editingId: string | null
): FormErrors {
  const errors: FormErrors = {}
  const name = form.name.trim()

  if (!name) {
    errors.name = 'Product name is required.'
  } else if (name.length < 3) {
    errors.name = 'Product name must contain at least 3 characters.'
  } else if (
    products.some(
      (product) =>
        product.id !== editingId &&
        product.name.trim().toLowerCase() === name.toLowerCase()
    )
  ) {
    errors.name = 'A product with this name already exists.'
  }

  if (!Number.isFinite(form.price) || form.price <= 0) {
    errors.price = 'Please enter a valid price greater than 0.'
  }

  if (
    !Number.isFinite(form.stock) ||
    !Number.isInteger(form.stock) ||
    form.stock < 0
  ) {
    errors.stock = 'Stock must be a whole number of 0 or more.'
  }

  return errors
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>(loadProducts)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All Categories')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<ProductForm>({ ...emptyForm })
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)
  const [toast, setToast] = useState<Toast | null>(null)

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const toastId = useRef(0)
  const saveInitialized = useRef(false)

  const showToast = (
    type: ToastType,
    title: string,
    message: string
  ) => {
    if (toastTimer.current) {
      clearTimeout(toastTimer.current)
    }

    toastId.current += 1
    setToast({ id: toastId.current, type, title, message })

    toastTimer.current = setTimeout(() => {
      setToast(null)
      toastTimer.current = null
    }, 4000)
  }

  useEffect(() => {
    return () => {
      if (toastTimer.current) {
        clearTimeout(toastTimer.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!saveInitialized.current) {
      saveInitialized.current = true
      return
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
    } catch (error) {
      console.error('Unable to save products:', error)
    }
  }, [products])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const query = search.toLowerCase().trim()

      const matchesSearch =
        product.name.toLowerCase().includes(query) ||
        product.id.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)

      const matchesCategory =
        categoryFilter === 'All Categories' ||
        product.category === categoryFilter

      const matchesStatus =
        statusFilter === 'All Status' ||
        (statusFilter === 'Published' && product.published) ||
        (statusFilter === 'Draft' && !product.published) ||
        (statusFilter === 'In Stock' && product.stock > 10) ||
        (statusFilter === 'Low Stock' &&
          product.stock > 0 &&
          product.stock <= 10) ||
        (statusFilter === 'Out of Stock' && product.stock === 0)

      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [products, search, categoryFilter, statusFilter])

  const totalProducts = products.length
  const publishedProducts = products.filter((p) => p.published).length
  const lowStockProducts = products.filter(
    (p) => p.stock > 0 && p.stock <= 10
  ).length
  const outOfStockProducts = products.filter((p) => p.stock === 0).length

  const openAddModal = () => {
    setEditingId(null)
    setForm({ ...emptyForm })
    setFormErrors({})
    setModalOpen(true)
  }

  const openEditModal = (product: Product) => {
    setEditingId(product.id)
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      description: product.description,
      image: product.image,
      featured: product.featured,
      published: product.published,
    })
    setFormErrors({})
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingId(null)
    setForm({ ...emptyForm })
    setFormErrors({})
  }

  const updateForm = <K extends keyof ProductForm>(
    key: K,
    value: ProductForm[K]
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }))

    if (key === 'name' || key === 'price' || key === 'stock') {
      setFormErrors((current) => ({
        ...current,
        [key]: undefined,
      }))
    }
  }

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      setFormErrors((current) => ({
        ...current,
        image: 'Please select a valid image file.',
      }))
      showToast('error', 'Invalid Image', 'Please select an image file.')
      event.target.value = ''
      return
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setFormErrors((current) => ({
        ...current,
        image: 'Image must be under 350 KB.',
      }))
      showToast(
        'error',
        'Image Too Large',
        'Please upload an image smaller than 350 KB.'
      )
      event.target.value = ''
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateForm('image', reader.result)
        setFormErrors((current) => ({
          ...current,
          image: undefined,
        }))
        showToast('success', 'Image Uploaded', 'Image preview is ready.')
      }
    }

    reader.onerror = () => {
      setFormErrors((current) => ({
        ...current,
        image: 'Unable to read this image.',
      }))
      showToast('error', 'Upload Failed', 'Could not read the image.')
    }

    reader.readAsDataURL(file)
    event.target.value = ''
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const errors = validateProduct(form, products, editingId)
    setFormErrors(errors)

    if (Object.keys(errors).length > 0) {
      showToast(
        'error',
        'Validation Error',
        'Please correct the highlighted fields.'
      )
      return
    }

    const cleanedName = form.name.trim()
    const cleanedDescription = form.description.trim()

    if (editingId) {
      setProducts((current) =>
        current.map((product) =>
          product.id === editingId
            ? {
                ...product,
                ...form,
                name: cleanedName,
                description: cleanedDescription,
              }
            : product
        )
      )

      showToast(
        'success',
        'Product Updated',
        `${cleanedName} has been updated successfully.`
      )
    } else {
      const newProduct: Product = {
        ...form,
        id: createProductId(),
        name: cleanedName,
        description: cleanedDescription,
        createdAt: new Date().toISOString().slice(0, 10),
      }

      setProducts((current) => [newProduct, ...current])

      showToast(
        'success',
        'Product Added',
        `${cleanedName} has been added successfully.`
      )
    }

    closeModal()
  }

  const handleDelete = () => {
    if (!deleteTarget) return

    const deletedName = deleteTarget.name

    setProducts((current) =>
      current.filter((product) => product.id !== deleteTarget.id)
    )

    setDeleteTarget(null)

    showToast(
      'success',
      'Product Deleted',
      `${deletedName} has been deleted successfully.`
    )
  }

  const togglePublished = (product: Product) => {
    setProducts((current) =>
      current.map((item) =>
        item.id === product.id
          ? { ...item, published: !item.published }
          : item
      )
    )

    showToast(
      'success',
      'Visibility Updated',
      `${product.name} is now ${product.published ? 'a draft' : 'published'}.`
    )
  }

  const resetDemoProducts = () => {
    if (
      !window.confirm(
        'Reset all products to the original demo data? Your local edits will be lost.'
      )
    ) {
      return
    }

    setProducts(initialProducts)

    showToast(
      'warning',
      'Demo Data Restored',
      'Your products have been reset to the original demo records.'
    )
  }

  return (
    <div className="products-page">
      {/* Premium toast notification */}
      {toast && (
        <div
          key={toast.id}
          className={`products-toast products-toast-${toast.type}`}
          role={toast.type === 'error' ? 'alert' : 'status'}
        >
          <div className="products-toast-icon">
            {toast.type === 'success' ? (
              <CheckCircle2 size={22} />
            ) : toast.type === 'error' ? (
              <AlertTriangle size={22} />
            ) : toast.type === 'warning' ? (
              <AlertTriangle size={22} />
            ) : (
              <Info size={22} />
            )}
          </div>

          <div className="products-toast-content">
            <strong>{toast.title}</strong>
            <p>{toast.message}</p>
          </div>

          <button
            type="button"
            onClick={() => setToast(null)}
            aria-label="Dismiss notification"
          >
            <X size={18} />
          </button>

          <div className="products-toast-progress" />
        </div>
      )}

      {/* Page Heading */}
      <div className="products-page-heading">
        <div>
          <div className="products-eyebrow">
            <Package size={16} />
            VEXORA / PRODUCT CONTROL
          </div>

          <h2>Product Management</h2>

          <p>
            Manage your CCTV products, pricing, availability and visibility.
          </p>
        </div>

        <button
          type="button"
          className="products-primary-button"
          onClick={openAddModal}
        >
          <Plus size={18} />
          Add New Product
        </button>
      </div>

      <div className="products-demo-notice">
        <AlertTriangle size={17} />
        Frontend demo: Product changes are saved only in this browser.
        They do not update the public VEXORA website.
      </div>

      {/* Stats */}
      <div className="products-stats">
        <div className="products-stat">
          <span className="products-stat-icon blue">
            <Boxes size={22} />
          </span>
          <div>
            <p>Total Products</p>
            <strong>{totalProducts}</strong>
          </div>
        </div>

        <div className="products-stat">
          <span className="products-stat-icon green">
            <Eye size={22} />
          </span>
          <div>
            <p>Published</p>
            <strong>{publishedProducts}</strong>
          </div>
        </div>

        <div className="products-stat">
          <span className="products-stat-icon orange">
            <AlertTriangle size={22} />
          </span>
          <div>
            <p>Low Stock</p>
            <strong>{lowStockProducts}</strong>
          </div>
        </div>

        <div className="products-stat">
          <span className="products-stat-icon red">
            <Package size={22} />
          </span>
          <div>
            <p>Out of Stock</p>
            <strong>{outOfStockProducts}</strong>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <section className="products-panel">
        <div className="products-panel-heading">
          <div>
            <h3>All Products</h3>
            <p>
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>

          <button
            type="button"
            className="products-reset-button"
            onClick={resetDemoProducts}
          >
            <RotateCcw size={15} />
            Reset Demo
          </button>
        </div>

        <div className="products-toolbar">
          <div className="products-search">
            <Search size={18} />
            <input
              type="search"
              placeholder="Search products by name, ID or category..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search products"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            aria-label="Filter by category"
          >
            <option>All Categories</option>
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter by status"
          >
            <option>All Status</option>
            <option>Published</option>
            <option>Draft</option>
            <option>In Stock</option>
            <option>Low Stock</option>
            <option>Out of Stock</option>
          </select>
        </div>

        <div className="products-table-scroll">
          <table className="products-table">
            <thead>
              <tr>
                <th>PRODUCT</th>
                <th>CATEGORY</th>
                <th>PRICE</th>
                <th>STOCK</th>
                <th>VISIBILITY</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.stock)

                return (
                  <tr key={product.id}>
                    <td>
                      <div className="products-product-cell">
                        <div className="products-thumbnail">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                            />
                          ) : (
                            <Package size={24} />
                          )}
                        </div>

                        <div>
                          <strong>{product.name}</strong>
                          <small>{product.id}</small>

                          {product.featured && (
                            <span className="products-featured">
                              FEATURED
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td>{product.category}</td>

                    <td className="products-price">
                      {formatPrice(product.price)}
                    </td>

                    <td>
                      <div className="products-stock-cell">
                        <strong>{product.stock} units</strong>
                        <span
                          className={`products-stock-badge ${
                            stockStatus === 'In Stock'
                              ? 'in-stock'
                              : stockStatus === 'Low Stock'
                                ? 'low-stock'
                                : 'out-stock'
                          }`}
                        >
                          {stockStatus}
                        </span>
                      </div>
                    </td>

                    <td>
                      <button
                        type="button"
                        className={`products-visibility ${
                          product.published ? 'published' : 'draft'
                        }`}
                        onClick={() => togglePublished(product)}
                        title="Toggle product visibility"
                      >
                        {product.published ? (
                          <Eye size={15} />
                        ) : (
                          <EyeOff size={15} />
                        )}
                        {product.published ? 'Published' : 'Draft'}
                      </button>
                    </td>

                    <td>
                      <div className="products-actions">
                        <button
                          type="button"
                          className="products-action-edit"
                          onClick={() => openEditModal(product)}
                          title="Edit product"
                          aria-label={`Edit ${product.name}`}
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          className="products-action-delete"
                          onClick={() => setDeleteTarget(product)}
                          title="Delete product"
                          aria-label={`Delete ${product.name}`}
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="products-empty">
                      <Search size={30} />
                      <strong>No products found</strong>
                      <p>Try another search or filter.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div
          className="products-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal()
            }
          }}
        >
          <section
            className="products-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="products-modal-title"
          >
            <div className="products-modal-header">
              <div>
                <p>VEXORA / PRODUCT EDITOR</p>
                <h2 id="products-modal-title">
                  {editingId ? 'Edit Product' : 'Add New Product'}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Close product editor"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="products-form-grid">
                <div className="products-form-field full">
                  <label htmlFor="product-name">PRODUCT NAME</label>
                  <input
                    id="product-name"
                    value={form.name}
                    onChange={(event) =>
                      updateForm('name', event.target.value)
                    }
                    placeholder="Enter CCTV product name"
                    maxLength={100}
                    aria-invalid={Boolean(formErrors.name)}
                    required
                  />
                  {formErrors.name && (
                    <p className="products-field-error">
                      <AlertTriangle size={13} />
                      {formErrors.name}
                    </p>
                  )}
                </div>

                <div className="products-form-field">
                  <label htmlFor="product-category">CATEGORY</label>
                  <select
                    id="product-category"
                    value={form.category}
                    onChange={(event) =>
                      updateForm(
                        'category',
                        event.target.value as ProductCategory
                      )
                    }
                  >
                    {categories.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* PRICE FIELD - STARTING ZERO FIXED */}
                <div className="products-form-field">
                  <label htmlFor="product-price">PRICE (LKR)</label>
                  <input
                    id="product-price"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="Enter product price in LKR"
                    value={form.price === 0 ? '' : form.price}
                    onChange={(event) => {
                      const value = event.target.value

                      updateForm(
                        'price',
                        value === '' ? 0 : Number(value)
                      )
                    }}
                    aria-invalid={Boolean(formErrors.price)}
                    required
                  />
                  {formErrors.price && (
                    <p className="products-field-error">
                      <AlertTriangle size={13} />
                      {formErrors.price}
                    </p>
                  )}
                </div>

                <div className="products-form-field">
                  <label htmlFor="product-stock">STOCK QUANTITY</label>
                  <input
                    id="product-stock"
                    type="number"
                    min="0"
                    step="1"
                    value={form.stock}
                    onChange={(event) =>
                      updateForm('stock', Number(event.target.value))
                    }
                    aria-invalid={Boolean(formErrors.stock)}
                    required
                  />
                  {formErrors.stock && (
                    <p className="products-field-error">
                      <AlertTriangle size={13} />
                      {formErrors.stock}
                    </p>
                  )}
                </div>

                <div className="products-form-field">
                  <label htmlFor="product-image">PRODUCT IMAGE</label>
                  <label className="products-upload" htmlFor="product-image">
                    <ImagePlus size={18} />
                    Choose Image (max 350 KB)
                  </label>
                  <input
                    id="product-image"
                    className="products-file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  {formErrors.image && (
                    <p className="products-field-error">
                      <AlertTriangle size={13} />
                      {formErrors.image}
                    </p>
                  )}
                </div>

                <div className="products-form-field full">
                  <label htmlFor="product-description">
                    PRODUCT DESCRIPTION
                  </label>
                  <textarea
                    id="product-description"
                    rows={4}
                    value={form.description}
                    onChange={(event) =>
                      updateForm('description', event.target.value)
                    }
                    placeholder="Describe this product..."
                    maxLength={1000}
                  />
                </div>

                {form.image && (
                  <div className="products-form-field full">
                    <label>IMAGE PREVIEW</label>
                    <div className="products-image-preview">
                      <img src={form.image} alt="Product preview" />
                      <button
                        type="button"
                        onClick={() => updateForm('image', '')}
                      >
                        Remove Image
                      </button>
                    </div>
                  </div>
                )}

                <div className="products-form-field full">
                  <div className="products-checkbox-row">
                    <label>
                      <input
                        type="checkbox"
                        checked={form.featured}
                        onChange={(event) =>
                          updateForm('featured', event.target.checked)
                        }
                      />
                      Featured Product
                    </label>

                    <label>
                      <input
                        type="checkbox"
                        checked={form.published}
                        onChange={(event) =>
                          updateForm('published', event.target.checked)
                        }
                      />
                      Published
                    </label>
                  </div>
                </div>
              </div>

              <div className="products-modal-footer">
                <button
                  type="button"
                  className="products-cancel-button"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="products-primary-button"
                >
                  <Save size={17} />
                  {editingId ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div className="products-modal-overlay">
          <section
            className="products-delete-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-product-title"
          >
            <div className="products-delete-icon">
              <Trash2 size={26} />
            </div>

            <h2 id="delete-product-title">Delete Product?</h2>

            <p>
              Are you sure you want to delete
              <strong> {deleteTarget.name}</strong>?
              This removes it from your local admin data.
            </p>

            <div className="products-delete-actions">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
              >
                <Trash2 size={16} />
                Delete Product
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
