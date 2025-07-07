import React, { useMemo, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Upload, Image as ImageIcon, FileText, Paperclip } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
  allowAttachments?: boolean;
  onAttachmentUpload?: (file: File) => Promise<string>;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "请输入内容...",
  height = "200px",
  allowAttachments = true,
  onAttachmentUpload
}) => {
  const quillRef = useRef<ReactQuill>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: () => handleImageUpload()
      }
    },
    clipboard: {
      matchVisual: false
    }
  }), []);

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'list', 'bullet', 'indent',
    'align', 'link', 'image'
  ];

  const handleImageUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件');
      return;
    }

    // 检查文件大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('图片大小不能超过5MB');
      return;
    }

    try {
      let imageUrl: string;
      
      if (onAttachmentUpload) {
        // 使用自定义上传处理器
        imageUrl = await onAttachmentUpload(file);
      } else {
        // 转换为base64
        imageUrl = await fileToBase64(file);
      }

      // 插入图片到编辑器
      const quill = quillRef.current?.getEditor();
      if (quill) {
        const range = quill.getSelection();
        const index = range ? range.index : quill.getLength();
        quill.insertEmbed(index, 'image', imageUrl);
        quill.setSelection(index + 1, 0);
      }
    } catch (error) {
      console.error('图片上传失败:', error);
      alert('图片上传失败，请重试');
    }

    // 清空input
    e.target.value = '';
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('accept', '*/*');
      fileInputRef.current.click();
    }
  };

  return (
    <div className="border-2 border-green-300 rounded-lg overflow-hidden bg-white shadow-sm">
      {/* 自定义工具栏 */}
      {allowAttachments && (
        <div className="border-b border-green-200 p-3 bg-green-50">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={handleImageUpload}
              className="flex items-center px-3 py-2 text-sm text-green-700 hover:text-green-800 hover:bg-green-100 rounded-md transition-colors border border-green-200 hover:border-green-300"
              title="插入图片"
            >
              <ImageIcon size={16} className="mr-2" />
              插入图片
            </button>
            <button
              type="button"
              onClick={handleAttachmentClick}
              className="flex items-center px-3 py-2 text-sm text-green-700 hover:text-green-800 hover:bg-green-100 rounded-md transition-colors border border-green-200 hover:border-green-300"
              title="添加附件"
            >
              <Paperclip size={16} className="mr-2" />
              添加附件
            </button>
            <div className="text-xs text-green-600 ml-auto">
              支持富文本格式、图片插入和文件附件
            </div>
          </div>
        </div>
      )}

      {/* 富文本编辑器 */}
      <div style={{ height }}>
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          style={{ height: `calc(${height} - 42px)` }}
        />
      </div>

      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* 编辑提示 */}
      <div className="px-4 py-2 bg-green-50 border-t border-green-200 text-xs text-green-700">
        <div className="flex items-center justify-between">
          <span>💡 提示：Ctrl+V 可直接粘贴图片，支持拖拽上传</span>
          <span className="text-green-600">字数：{value.replace(/<[^>]*>/g, '').length}</span>
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor;
