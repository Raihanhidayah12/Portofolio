import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { supabase } from "../../supabase";
import { Camera, Upload, Trash2, ImageIcon, Plus, Edit2, Eye, EyeOff } from 'lucide-react'
import {
  DashboardCard,
  DashboardPageIcon,
  PrimaryButton,
  SecondaryButton,
  GlowButton,
  inputClass,
} from '../../components/ui/layout'

const SkeletonCard = () => (
  <div className="relative">
    <div className="relative border border-zinc-800 bg-zinc-950/70 overflow-hidden">
      <div className="w-full aspect-square bg-white/5 animate-pulse" />
    </div>
  </div>
)

const PhotoCard = React.memo(({ photo, onDelete, onTogglePublish, onEdit }) => {
  const [imgLoaded, setImgLoaded] = useState(false)
  const categoryLabel = (photo.category || 'general').replace('-', ' ')

  return (
    <div className="group relative">
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/70 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-2">
          <span className="rounded-full border border-white/10 bg-black/65 px-2 py-1 text-[10px] uppercase tracking-[0.25em] text-zinc-200 backdrop-blur-sm">
            {categoryLabel}
          </span>
          <button
            onClick={() => onTogglePublish(photo.id, !photo.is_published)}
            className={`rounded-full p-1.5 backdrop-blur-sm transition-colors ${
              photo.is_published
                ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                : 'bg-zinc-800/70 text-zinc-400 hover:bg-zinc-800'
            }`}
            title={photo.is_published ? 'Published' : 'Unpublished'}
          >
            {photo.is_published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          </button>
        </div>

        {!imgLoaded && <div className="aspect-square w-full animate-pulse bg-white/5" />}
        <img
          src={photo.image_url}
          alt={photo.title || 'Photo'}
          onLoad={() => setImgLoaded(true)}
          className={`aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105 ${imgLoaded ? 'block' : 'hidden'}`}
        />

        {imgLoaded && (
          <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                {photo.title ? (
                  <p className="truncate text-sm font-semibold text-white">{photo.title}</p>
                ) : (
                  <p className="truncate text-sm font-semibold text-zinc-300">Untitled photo</p>
                )}
                <p className="text-[11px] text-zinc-400">{photo.is_published ? 'Published' : 'Draft'}</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <GlowButton
                type="button"
                variant="ghost"
                onClick={() => onEdit(photo)}
                wrapperClassName="flex-1"
                className="w-full !text-sky-300 hover:!text-sky-200"
              >
                <Edit2 className="w-3 h-3" /> Edit
              </GlowButton>
              <GlowButton
                type="button"
                variant="ghost"
                onClick={() => onDelete(photo.id, photo.image_url)}
                wrapperClassName="flex-1"
                className="w-full !text-red-300 hover:!text-red-200"
              >
                <Trash2 className="w-3 h-3" /> Delete
              </GlowButton>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}, (prev, next) => {
  // only re-render when key visible props change
  const a = prev.photo
  const b = next.photo
  return a.id === b.id && a.is_published === b.is_published && a.title === b.title && a.image_url === b.image_url && a.category === b.category
})

export default function Photos() {
  const [photos, setPhotos] = useState([])
  const [filterCategory, setFilterCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [compactGrid, setCompactGrid] = useState(false)
  const [sortBy, setSortBy] = useState('order')
  const [page, setPage] = useState(1)
  const pageSize = 24
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [loading, setLoading] = useState(true)
  const [editingPhoto, setEditingPhoto] = useState(null)
  const [statusMessage, setStatusMessage] = useState({ type: 'idle', text: '' })
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    order_index: 0
  })

  const fetchPhotos = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: false })

      if (error) throw error
      setPhotos(data || [])
    } catch (error) {
      setStatusMessage({ type: 'error', text: 'Gagal memuat foto dari database.' })
      setPhotos([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPhotos() }, [])

  // debounce search input to avoid re-filtering on every keypress
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 300)
    return () => clearTimeout(t)
  }, [searchQuery])

  const uniqueCategories = useMemo(() => Array.from(new Set(photos.map(p => p.category || 'general'))), [photos])

  const filteredPhotos = useMemo(() => {
    const q = (debouncedSearch || '').toLowerCase()
    return photos
      .filter(p => filterCategory === 'all' ? true : (p.category || 'general') === filterCategory)
      .filter(p => !q ? true : ((p.title || '').toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q)))
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.created_at) - new Date(a.created_at)
        if (sortBy === 'oldest') return new Date(a.created_at) - new Date(b.created_at)
        return (a.order_index || 0) - (b.order_index || 0)
      })
  }, [photos, filterCategory, debouncedSearch, sortBy])

  // reset page when filters/search change
  useEffect(() => { setPage(1) }, [filterCategory, debouncedSearch, sortBy])

  const totalPages = Math.max(1, Math.ceil(filteredPhotos.length / pageSize))
  const paginatedPhotos = filteredPhotos.slice((page - 1) * pageSize, page * pageSize)

  const getStorageFileName = (imageUrl) => {
    if (!imageUrl) return null

    try {
      const url = new URL(imageUrl)
      const parts = decodeURIComponent(url.pathname).split('/').filter(Boolean)
      return parts[parts.length - 1] || null
    } catch {
      const parts = imageUrl.split('/').filter(Boolean)
      return parts[parts.length - 1] || null
    }
  }

  const handleFile = (f) => {
    if (!f) return

    if (f.size > 5 * 1024 * 1024) {
      setStatusMessage({ type: 'error', text: 'Ukuran file maksimal 5MB.' })
      return
    }

    setFile(f)
    setPreview(URL.createObjectURL(f))
    setStatusMessage({ type: 'idle', text: '' })
  }

  const uploadImage = async () => {
    if (!file) return

    setUploading(true)
    setStatusMessage({ type: 'loading', text: editingPhoto ? 'Mengupdate foto...' : 'Mengupload foto...' })

    try {
      const safeFileName = `photo-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`
      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(safeFileName, file, { cacheControl: '3600', upsert: false })

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('photos').getPublicUrl(safeFileName)
      const payload = {
        image_url: data.publicUrl,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        order_index: parseInt(formData.order_index || 0, 10)
      }

      if (editingPhoto) {
        const { error: updateError } = await supabase
          .from('photos')
          .update(payload)
          .eq('id', editingPhoto.id)

        if (updateError) throw updateError

        const oldFileName = getStorageFileName(editingPhoto.image_url)
        if (oldFileName && oldFileName !== safeFileName) {
          await supabase.storage.from('photos').remove([oldFileName])
        }
      } else {
        const { error: insertError } = await supabase.from('photos').insert({
          ...payload,
          is_published: true
        })

        if (insertError) throw insertError
      }

      resetForm()
      await fetchPhotos()
      setStatusMessage({ type: 'success', text: editingPhoto ? 'Foto berhasil diperbarui.' : 'Foto berhasil disimpan.' })
    } catch (error) {
      setStatusMessage({ type: 'error', text: error?.message || 'Upload gagal.' })
    } finally {
      setUploading(false)
    }
  }

  const savePhotoMetadata = async () => {
    if (!editingPhoto) return

    setUploading(true)
    setStatusMessage({ type: 'loading', text: 'Menyimpan perubahan...' })

    try {
      const { error } = await supabase
        .from('photos')
        .update({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          order_index: parseInt(formData.order_index || 0, 10)
        })
        .eq('id', editingPhoto.id)

      if (error) throw error

      resetForm()
      await fetchPhotos()
      setStatusMessage({ type: 'success', text: 'Metadata foto berhasil disimpan.' })
    } catch (error) {
      setStatusMessage({ type: 'error', text: error?.message || 'Gagal menyimpan metadata.' })
    } finally {
      setUploading(false)
    }
  }

  const deletePhoto = useCallback(async (id, imageUrl) => {
    if (!confirm('Hapus foto ini?')) return

    try {
      const fileName = getStorageFileName(imageUrl)
      if (fileName) {
        await supabase.storage.from('photos').remove([fileName])
      }

      const { error } = await supabase.from('photos').delete().eq('id', id)
      if (error) throw error

      await fetchPhotos()
      setStatusMessage({ type: 'success', text: 'Foto berhasil dihapus.' })
    } catch (error) {
      setStatusMessage({ type: 'error', text: error?.message || 'Gagal menghapus foto.' })
    }
  }, [/* fetchPhotos used inside will be stable between renders */])

  const togglePublish = useCallback(async (id, isPublished) => {
    try {
      const { error } = await supabase
        .from('photos')
        .update({ is_published: isPublished })
        .eq('id', id)

      if (error) throw error

      await fetchPhotos()
      setStatusMessage({ type: 'success', text: isPublished ? 'Foto dipublikasikan.' : 'Foto disembunyikan.' })
    } catch (error) {
      setStatusMessage({ type: 'error', text: error?.message || 'Gagal mengubah status publikasi.' })
    }
  }, [])

  const startEdit = useCallback((photo) => {
    setEditingPhoto(photo)
    setFormData({
      title: photo.title || '',
      description: photo.description || '',
      category: photo.category || 'general',
      order_index: photo.order_index || 0
    })
    setPreview(photo.image_url)
    setStatusMessage({ type: 'idle', text: '' })
  }, [])

  const resetForm = () => {
    setFile(null)
    setPreview(null)
    setEditingPhoto(null)
    setFormData({
      title: '',
      description: '',
      category: 'general',
      order_index: 0
    })
  }

  const publishedCount = photos.filter((photo) => photo.is_published).length
  const unpublishedCount = photos.length - publishedCount

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <DashboardPageIcon>
            <Camera className="w-4 h-4" />
          </DashboardPageIcon>
          <div>
            <h2 className="text-xl font-bold text-zinc-100">Photography</h2>
            <p className="text-xs text-zinc-500">Kelola galeri foto portfolio Anda</p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
          <p className="text-[11px] uppercase tracking-[0.25em] text-zinc-500">Total Foto</p>
          <p className="mt-2 text-2xl font-semibold text-white">{photos.length}</p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
          <p className="text-[11px] uppercase tracking-[0.25em] text-zinc-500">Published</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-300">{publishedCount}</p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4">
          <p className="text-[11px] uppercase tracking-[0.25em] text-zinc-500">Draft</p>
          <p className="mt-2 text-2xl font-semibold text-amber-300">{unpublishedCount}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul atau deskripsi..."
            className="w-64 rounded-md px-3 py-2 text-sm bg-zinc-900/80 border border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className={`${inputClass} rounded-md px-3 py-2 w-40`}>
            <option value="all">Semua Kategori</option>
            {uniqueCategories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={`${inputClass} rounded-md px-3 py-2 w-40`}>
            <option value="order">Urut: Index</option>
            <option value="newest">Urut: Terbaru</option>
            <option value="oldest">Urut: Terlama</option>
          </select>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => setCompactGrid(!compactGrid)} className="rounded-md px-3 py-2 text-sm bg-zinc-800/60 text-zinc-200 hover:bg-zinc-800">{compactGrid ? 'Mode Biasa' : 'Compact Grid'}</button>
        </div>
      </div>

      {/* Upload Form */}
      <DashboardCard>
        <div className="mb-4 flex items-start justify-between gap-3 border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <ImageIcon className="w-5 h-5 text-sky-400" />
            <div>
              <h3 className="font-semibold text-zinc-100">
                {editingPhoto ? 'Edit Photo' : 'Upload New Photo'}
              </h3>
              <p className="text-xs text-zinc-500">
                Tambah atau perbarui foto untuk ditampilkan di halaman portfolio.
              </p>
            </div>
          </div>
        </div>

        {statusMessage.text && (
          <div className={`mb-4 rounded border px-3 py-2 text-sm ${
            statusMessage.type === 'error'
              ? 'border-red-500/30 bg-red-500/10 text-red-300'
              : statusMessage.type === 'success'
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                : 'border-sky-500/30 bg-sky-500/10 text-sky-300'
          }`}>
            {statusMessage.text}
          </div>
        )}

        {/* Metadata Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Title <span className="text-zinc-600">(optional)</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Sunset at Beach"
              className={`${inputClass} rounded-md px-3 py-2 text-sm`}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className={`${inputClass} rounded-md px-3 py-2 text-sm`}
            >
              <option value="general">General</option>
              <option value="landscape">Landscape</option>
              <option value="portrait">Portrait</option>
              <option value="urban">Urban</option>
              <option value="nature">Nature</option>
              <option value="event">Event</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Description <span className="text-zinc-600">(optional)</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the photo..."
              rows={2}
              className={`${inputClass} rounded-md px-3 py-2 text-sm resize-none`}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Order Index
            </label>
            <input
              type="number"
              value={formData.order_index}
              onChange={(e) => setFormData({ ...formData, order_index: e.target.value })}
              placeholder="0"
              className={`${inputClass} rounded-md px-3 py-2 text-sm`}
            />
          </div>
        </div>

        {/* Image Upload/Preview */}
        {preview ? (
          <div className="space-y-3">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-3">
              <p className="mb-2 text-[11px] uppercase tracking-[0.25em] text-zinc-500">Preview</p>
              <img
                src={preview}
                alt="Preview"
                className="max-h-80 w-full rounded-xl border border-zinc-800 bg-zinc-950/50 object-contain"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {editingPhoto && !file && (
                <PrimaryButton onClick={savePhotoMetadata} disabled={uploading}>
                  {uploading ? 'Saving...' : 'Save Changes'}
                </PrimaryButton>
              )}
              {file && (
                <PrimaryButton onClick={uploadImage} disabled={uploading}>
                  <Upload className="w-3 h-3" />
                  {uploading ? 'Uploading...' : editingPhoto ? 'Update Photo' : 'Upload Photo'}
                </PrimaryButton>
              )}
              <SecondaryButton onClick={resetForm}>
                Cancel
              </SecondaryButton>
            </div>
          </div>
        ) : (
          <div
            className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-colors ${
              dragOver ? 'border-sky-500 bg-sky-500/5' : 'border-zinc-800 hover:border-zinc-700'
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragOver(false)
              handleFile(e.dataTransfer.files[0])
            }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFile(e.target.files[0])}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-3 rounded-full border border-zinc-800 bg-zinc-900/70 p-3">
                <Plus className="h-8 w-8 text-zinc-500" />
              </div>
              <p className="mb-1 text-sm text-zinc-300">Klik atau seret foto ke sini</p>
              <p className="text-xs text-zinc-600">JPG, PNG, atau WebP · maksimal 5MB</p>
            </div>
          </div>
        )}
      </DashboardCard>

      {/* Photo Grid */}
      <DashboardCard>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <ImageIcon className="w-5 h-5 text-sky-400" />
            <h3 className="font-semibold text-zinc-100">
              All Photos ({photos.length})
            </h3>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40 py-14 text-center text-zinc-600">
            <Camera className="mx-auto mb-3 h-12 w-12 text-zinc-700" />
            <p className="text-sm text-zinc-400">Belum ada foto. Tambahkan foto pertama Anda di bagian atas.</p>
          </div>
        ) : (
          <>
            <div className={`${compactGrid ? 'grid-cols-3 md:grid-cols-6 lg:grid-cols-8' : 'grid-cols-2 md:grid-cols-4 lg:grid-cols-5'} grid gap-3`}>
              {paginatedPhotos.map((photo) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  onDelete={deletePhoto}
                  onTogglePublish={togglePublish}
                  onEdit={startEdit}
                />
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-zinc-400">Halaman {page} / {totalPages}</div>
              <div className="flex items-center gap-2">
                <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="rounded-md px-3 py-1 bg-zinc-800/60 text-zinc-200 disabled:opacity-50">Prev</button>
                <button disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="rounded-md px-3 py-1 bg-zinc-800/60 text-zinc-200 disabled:opacity-50">Next</button>
              </div>
            </div>
          </>
        )}
      </DashboardCard>
    </div>
  )
}
