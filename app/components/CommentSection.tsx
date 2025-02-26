'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Comment {
  id: string
  activityId: string
  author: string
  content: string
  createdAt: string
}

interface CommentSectionProps {
  activityId: string
}

export default function CommentSection({ activityId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(() => {
    const savedComments = localStorage.getItem(`comments-${activityId}`)
    return savedComments ? JSON.parse(savedComments) : []
  })
  const [newComment, setNewComment] = useState('')

  const addComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      activityId,
      author: 'Usuário', // Será substituído pelo nome do usuário quando implementarmos autenticação
      content: newComment.trim(),
      createdAt: new Date().toISOString(),
    }

    const updatedComments = [...comments, comment]
    setComments(updatedComments)
    localStorage.setItem(`comments-${activityId}`, JSON.stringify(updatedComments))
    setNewComment('')
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-[var(--primary-color)] mb-4">
        Comentários
      </h3>

      <form onSubmit={addComment} className="mb-6">
        <div className="flex gap-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Adicione um comentário..."
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--secondary-color)] resize-none"
            rows={2}
          />
          <button
            type="submit"
            className="px-6 py-2 bg-[var(--secondary-color)] text-[var(--primary-color)] font-semibold rounded-lg hover:bg-[#ffc926] transition-colors self-end"
            disabled={!newComment.trim()}
          >
            Comentar
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            Nenhum comentário ainda. Seja o primeiro a comentar!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-white rounded-lg shadow-sm p-4 border border-gray-100"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[var(--primary-color)] text-white rounded-full flex items-center justify-center">
                    {comment.author[0].toUpperCase()}
                  </div>
                  <span className="font-medium">{comment.author}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {format(new Date(comment.createdAt), "d 'de' MMMM 'às' HH:mm", {
                    locale: ptBR,
                  })}
                </span>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
