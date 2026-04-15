'use client';

import { useEffect, useState } from 'react';
import { API_BASE } from '@/lib/api';

type Option = {
  id: number;
  name: string;
  slug: string;
};

type CommentType = {
  id: number;
  content: string;
  rating: number;
  created_at?: string;
  user?: {
    id: number;
    name: string;
    email?: string;
  } | null;
};

export default function ToolCard({
  tool,
  onDelete,
  token,
}: {
  tool: any;
  onDelete?: (id: number) => void;
  token?: string;
}) {
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [commentMessage, setCommentMessage] = useState('');
  const [commentError, setCommentError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);

  const fetchComments = async () => {
    try {
      if (!token?.trim()) return;

      setLoadingComments(true);

      const res = await fetch(`${API_BASE}/tools/${tool.id}/comments`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to load comments.');
      }

      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [token, tool.id]);

  const submitComment = async () => {
    try {
      if (!token?.trim()) {
        setCommentError('Please load a valid token first.');
        return;
      }

      if (!content.trim()) {
        setCommentError('Please enter a comment.');
        return;
      }

      setSubmitting(true);
      setCommentError('');
      setCommentMessage('');

      const res = await fetch(`${API_BASE}/tools/${tool.id}/comments`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          rating,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || 'Failed to submit comment.');
      }

      setCommentMessage('Comment submitted successfully.');
      setContent('');
      setRating(5);
      await fetchComments();
    } catch (err) {
      setCommentError(
        err instanceof Error ? err.message : 'Comment submission failed.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating =
    comments.length > 0
      ? (
          comments.reduce((sum, comment) => sum + comment.rating, 0) /
          comments.length
        ).toFixed(1)
      : null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{tool.name}</h3>
          {tool.user && (
            <p className="mt-1 text-sm text-slate-500">
              Added by {tool.user.name}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {tool.is_featured && (
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              Featured
            </span>
          )}
          {tool.difficulty_level && (
            <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 capitalize">
              {tool.difficulty_level}
            </span>
          )}
          {averageRating && (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
              ★ {averageRating}
            </span>
          )}
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-600">
        {tool.description}
      </p>

      <div className="mt-4 space-y-2 text-sm text-slate-600">
        <p>
          <span className="font-semibold text-slate-800">Link:</span>{' '}
          <a
            href={tool.url}
            target="_blank"
            rel="noreferrer"
            className="text-indigo-600 hover:underline"
          >
            Open tool
          </a>
        </p>

        {tool.documentation_url && (
          <p>
            <span className="font-semibold text-slate-800">Docs:</span>{' '}
            <a
              href={tool.documentation_url}
              target="_blank"
              rel="noreferrer"
              className="text-indigo-600 hover:underline"
            >
              Official documentation
            </a>
          </p>
        )}
      </div>

      <div className="mt-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Categories
        </p>
        <div className="flex flex-wrap gap-2">
          {tool.categories.length > 0 ? (
            tool.categories.map((category: Option) => (
              <span
                key={category.id}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
              >
                {category.name}
              </span>
            ))
          ) : (
            <span className="text-sm text-slate-400">No categories</span>
          )}
        </div>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Roles
        </p>
        <div className="flex flex-wrap gap-2">
          {tool.roles.length > 0 ? (
            tool.roles.map((role: Option) => (
              <span
                key={role.id}
                className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
              >
                {role.name}
              </span>
            ))
          ) : (
            <span className="text-sm text-slate-400">No roles</span>
          )}
        </div>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Tags
        </p>
        <div className="flex flex-wrap gap-2">
          {tool.tags.length > 0 ? (
            tool.tags.map((tag: Option) => (
              <span
                key={tag.id}
                className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700"
              >
                {tag.name}
              </span>
            ))
          ) : (
            <span className="text-sm text-slate-400">No tags</span>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="mb-3 text-sm font-semibold text-slate-800">
          Add Comment & Rating
        </p>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          className="min-h-[90px] w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            <option value={1}>1 star</option>
            <option value={2}>2 stars</option>
            <option value={3}>3 stars</option>
            <option value={4}>4 stars</option>
            <option value={5}>5 stars</option>
          </select>

          <button
            onClick={submitComment}
            disabled={submitting}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Submitting...' : 'Submit Comment'}
          </button>
        </div>

        {commentError && (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {commentError}
          </div>
        )}

        {commentMessage && (
          <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {commentMessage}
          </div>
        )}
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-800">Comments</p>
          {averageRating && (
            <span className="text-sm font-medium text-amber-600">
              Average rating: ★ {averageRating}
            </span>
          )}
        </div>

        {loadingComments && (
          <p className="text-sm text-slate-500">Loading comments...</p>
        )}

        {!loadingComments && comments.length === 0 && (
          <p className="text-sm text-slate-500">
            No comments yet. Be the first to leave feedback.
          </p>
        )}

        {!loadingComments && comments.length > 0 && (
          <div className="space-y-3">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="rounded-lg border border-slate-200 bg-slate-50 p-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-800">
                    {comment.user?.name || 'Unknown user'}
                  </p>
                  <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">
                    {comment.rating} / 5
                  </span>
                </div>

                <p className="mt-2 text-sm text-slate-600">{comment.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-end">
        <button
          onClick={() => onDelete?.(tool.id)}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
}