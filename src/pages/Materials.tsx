import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import {
    FileText,
    Download,
    Upload,
    Plus,
    X,
    Loader2,
    File,
    Video,
    Image as ImageIcon
} from 'lucide-react';
import clsx from 'clsx';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Material {
    id: string;
    title: string;
    description: string;
    category: string;
    file_url: string;
    file_type: string;
    created_at: string;
}

export function Materials() {
    const { user } = useAuth();
    const [materials, setMaterials] = useState<Material[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    // Upload Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Geral');
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        fetchMaterials();
    }, []);

    async function fetchMaterials() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('materials')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setMaterials(data || []);
        } catch (error) {
            console.error('Error fetching materials:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleUpload(e: React.FormEvent) {
        e.preventDefault();
        if (!file || !user) return;

        try {
            setUploading(true);

            // 1. Upload file to Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${user.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('materials')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('materials')
                .getPublicUrl(filePath);

            // 3. Save Metadata to DB
            const { error: dbError } = await supabase
                .from('materials')
                .insert({
                    title,
                    description,
                    category,
                    file_url: publicUrl,
                    file_type: fileExt,
                    file_size: file.size,
                    user_id: user.id
                });

            if (dbError) throw dbError;

            // Reset and Refresh
            setIsUploadModalOpen(false);
            setTitle('');
            setDescription('');
            setCategory('Geral');
            setFile(null);
            fetchMaterials();

        } catch (error) {
            console.error('Error uploading material:', error);
            alert('Erro ao fazer upload. Tente novamente.');
        } finally {
            setUploading(false);
        }
    }

    const getFileIcon = (type: string) => {
        if (['pdf'].includes(type)) return <FileText size={24} className="text-red-400" />;
        if (['mp4', 'mov'].includes(type)) return <Video size={24} className="text-blue-400" />;
        if (['jpg', 'png', 'jpeg'].includes(type)) return <ImageIcon size={24} className="text-emerald-400" />;
        return <File size={24} className="text-zinc-400" />;
    };

    return (
        <div className="space-y-8 animate-in fade-in max-w-7xl mx-auto pb-12">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Materiais de Apoio</h1>
                    <p className="text-zinc-400">Conteúdos exclusivos da mentoria para acelerar sua aprovação.</p>
                </div>
                <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="flex items-center gap-2 bg-primary text-black px-4 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
                    <Plus size={20} />
                    Novo Material
                </button>
            </div>

            {/* Filters (Placeholder for now) */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {['Todos', 'Aulas', 'Listas', 'Resumos', 'Simulados'].map((tab) => (
                    <button
                        key={tab}
                        className={clsx(
                            "px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                            tab === 'Todos'
                                ? "bg-white text-black"
                                : "bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800"
                        )}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="animate-spin text-primary" size={32} />
                </div>
            ) : materials.length === 0 ? (
                <div className="text-center py-20 bg-zinc-900/50 rounded-2xl border border-zinc-800 border-dashed">
                    <FileText size={48} className="mx-auto text-zinc-600 mb-4" />
                    <h3 className="text-xl font-medium text-white mb-2">Nenhum material encontrado</h3>
                    <p className="text-zinc-400">Clique em "Novo Material" para começar.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {materials.map((item) => (
                        <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-600 hover:bg-zinc-800/50 transition-all group relative flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-zinc-950 rounded-xl group-hover:scale-110 transition-transform border border-zinc-800">
                                    {getFileIcon(item.file_type)}
                                </div>
                                <span className="text-[10px] font-bold text-zinc-400 bg-zinc-950/50 px-3 py-1.5 rounded-full uppercase tracking-wider border border-zinc-800">
                                    {item.category}
                                </span>
                            </div>

                            <div className="flex-1">
                                <a
                                    href={item.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block group-hover:underline decoration-zinc-500 underline-offset-4"
                                >
                                    <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                                        {item.title}
                                    </h3>
                                </a>
                                <p className="text-zinc-400 text-sm line-clamp-3">
                                    {item.description || 'Sem descrição.'}
                                </p>
                            </div>

                            <div className="flex items-center justify-between pt-6 mt-4 border-t border-zinc-800/50">
                                <span className="text-xs text-zinc-600 font-medium">
                                    {format(new Date(item.created_at), "d 'de' MMM, yyyy", { locale: ptBR })}
                                </span>
                                <a
                                    href={item.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-xs font-bold text-black bg-primary hover:bg-primary/90 transition-colors px-4 py-2 rounded-lg uppercase tracking-wide shadow-lg shadow-primary/10"
                                >
                                    <Download size={14} />
                                    Acessar
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Modal */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                            <h2 className="text-xl font-bold text-white">Novo Material</h2>
                            <button
                                onClick={() => setIsUploadModalOpen(false)}
                                className="text-zinc-400 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleUpload} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400">Título</label>
                                <input
                                    required
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                    placeholder="Ex: Lista de Exercícios - Logaritmos"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400">Categoria</label>
                                <select
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors appearance-none"
                                >
                                    <option value="Geral">Geral</option>
                                    <option value="Aulas">Aulas</option>
                                    <option value="Listas">Listas</option>
                                    <option value="Resumos">Resumos</option>
                                    <option value="Simulados">Simulados</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400">Descrição</label>
                                <textarea
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors h-24 resize-none"
                                    placeholder="Breve descrição do conteúdo..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400">Arquivo</label>
                                <div className="border-2 border-dashed border-zinc-800 rounded-xl p-8 text-center hover:bg-zinc-900/50 hover:border-zinc-700 transition-all cursor-pointer relative group">
                                    <input
                                        type="file"
                                        required
                                        onChange={e => setFile(e.target.files?.[0] || null)}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    <div className="flex flex-col items-center gap-2 pointer-events-none">
                                        <Upload size={32} className="text-zinc-600 group-hover:text-primary transition-colors" />
                                        <p className="text-sm text-zinc-400 font-medium">
                                            {file ? file.name : 'Clique ou arraste para enviar'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="w-full bg-primary hover:bg-primary/90 text-black font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {uploading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            Enviando...
                                        </>
                                    ) : (
                                        'Publicar Material'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
