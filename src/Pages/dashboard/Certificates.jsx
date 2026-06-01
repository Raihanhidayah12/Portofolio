import { useEffect, useState } from 'react'
import { supabase } from "../../supabase";
import { mapCertificates, certificateToDb } from "../../utils/supabase/mappers";
import { Award, Upload, Trash2, ImageIcon, Plus } from 'lucide-react'
import {
  DashboardCard,
  DashboardPageIcon,
  PrimaryButton,
  SecondaryButton,
  GlowButton,
} from '../../components/ui/layout'

const SkeletonCard = () => (
  <div className="relative">
    <div className="relative border border-zinc-800 bg-zinc-950/70 overflow-hidden">
      <div className="w-full aspect-[16/11.5] bg-white/5 animate-pulse" />
    </div>
  </div>
)

const CertCard = ({ cert, onDelete }) => {
  const [imgLoaded, setImgLoaded] = useState(false)

  return (
    <div className="relative group">
      <div className="relative border border-zinc-800 bg-zinc-950/70 overflow-hidden">
        {/* Skeleton shown until image loads */}
        {!imgLoaded && (
          <div className="w-full aspect-[16/11.5] bg-white/5 animate-pulse" />
        )}
        <img
          src={cert.Img}
          alt="Certificate"
          onLoad={() => setImgLoaded(true)}
          className={`w-full aspect-[16/11.5] object-cover group-hover:scale-105 transition-transform duration-500 ${imgLoaded ? 'block' : 'hidden'}`}
        />
        {imgLoaded && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
            <GlowButton
              type="button"
              variant="ghost"
              onClick={() => onDelete(cert.id)}
              wrapperClassName="w-full"
              className="w-full !text-red-300 hover:!text-red-200"
            >
              <Trash2 className="w-3 h-3" /> Delete
            </GlowButton>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Certificates() {
  const [certs, setCerts] = useState([])
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchCerts = async () => {
    setLoading(true)
    const { data } = await supabase.from('certificates').select('*').order('created_at', { ascending: false })
    setCerts(mapCertificates(data))
    setLoading(false)
  }

  useEffect(() => { fetchCerts() }, [])

  const handleFile = (f) => {
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const uploadImage = async () => {
    if (!file) return
    setUploading(true)
    const fileName = `cert-${Date.now()}-${file.name}`
    await supabase.storage.from('certificate-images').upload(fileName, file)
    const { data } = supabase.storage.from('certificate-images').getPublicUrl(fileName)
    await supabase.from('certificates').insert(certificateToDb({ Img: data.publicUrl }))
    setFile(null); setPreview(null); setUploading(false)
    fetchCerts()
  }

  const deleteCert = async (id) => {
    if (!confirm('Delete this certificate?')) return
    await supabase.from('certificates').delete().eq('id', id)
    fetchCerts()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <DashboardPageIcon>
          <Award className="w-4 h-4" />
        </DashboardPageIcon>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-100">Certificates</h1>
          <p className="text-zinc-600 text-xs font-mono uppercase tracking-wider">
            {loading ? 'Loading...' : `${certs.length} certificates total`}
          </p>
        </div>
      </div>

      {/* Upload Card */}
      <DashboardCard>
        <div className="p-5 sm:p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-sky-400" /> Upload Certificate
          </h2>

          <label
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]) }}
            className={`flex flex-col items-center justify-center w-full min-h-[160px] rounded-xl border-2 border-dashed cursor-pointer transition-all duration-300 ${
              dragOver ? 'border-sky-400/60 bg-sky-500/10' : 'border-zinc-700 bg-zinc-900/50 hover:border-sky-500/35'
            }`}
          >
            {preview ? (
              <img src={preview} alt="preview" className="max-h-40 object-contain rounded-lg p-2" />
            ) : (
              <div className="text-center space-y-2 p-6">
                <div className="w-11 h-11 border border-sky-500/20 bg-sky-500/10 flex items-center justify-center mx-auto">
                  <ImageIcon className="w-5 h-5 text-sky-400" />
                </div>
                <p className="text-sm text-gray-300">Drag & drop or click to upload</p>
                <p className="text-xs text-gray-600">PNG, JPG, WEBP supported</p>
              </div>
            )}
            <input type="file" accept="image/*" onChange={e => handleFile(e.target.files[0])} className="hidden" />
          </label>

          {file && (
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <p className="text-xs text-gray-400 truncate flex-1">{file.name}</p>
              <div className="flex gap-2 shrink-0">
                <SecondaryButton
                  type="button"
                  onClick={() => { setFile(null); setPreview(null) }}
                  className="!px-3 !py-1.5 !text-xs !text-gray-500"
                >
                  Clear
                </SecondaryButton>
                <PrimaryButton
                  type="button"
                  onClick={uploadImage}
                  disabled={uploading}
                  className="!px-4 !py-1.5 !text-xs"
                >
                  {uploading ? <div className="w-3.5 h-3.5 border-2 border-zinc-900/30 border-t-zinc-900 rounded-full animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  <span>{uploading ? 'Uploading...' : 'Upload'}</span>
                </PrimaryButton>
              </div>
            </div>
          )}
        </div>
      </DashboardCard>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : certs.length === 0 ? (
        <DashboardCard>
          <div className="p-16 text-center">
            <Award className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500 text-sm">No certificates yet.</p>
          </div>
        </DashboardCard>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {certs.map(cert => (
            <CertCard key={cert.id} cert={cert} onDelete={deleteCert} />
          ))}
        </div>
      )}
    </div>
  )
}