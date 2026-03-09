import React, { useEffect, useState, useRef } from 'react';
import { cn } from './Common';

interface TypewriterProps {
  text: string;
  isStreaming?: boolean;
  speed?: number; // ms per character
  onComplete?: () => void;
  className?: string;
  respectReducedMotion?: boolean;
}

/**
 * Typewriter Effect Component
 * Displays text character by character with smooth animation
 * Perfect for streaming AI responses
 */
export const Typewriter: React.FC<TypewriterProps> = ({
  text,
  isStreaming = false,
  speed = 15,
  onComplete,
  className,
  respectReducedMotion = true,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(isStreaming);
  const indexRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout>(undefined);
  const prefersReducedMotion = respectReducedMotion 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  useEffect(() => {
    setIsTyping(isStreaming);
  }, [isStreaming]);

  useEffect(() => {
    if (prefersReducedMotion) {
      // Skip animation if reduced motion is preferred
      setDisplayedText(text);
      setIsTyping(false);
      onComplete?.();
      return;
    }

    const type = () => {
      if (indexRef.current <= text.length) {
        setDisplayedText(text.slice(0, indexRef.current));
        indexRef.current += 1;

        if (indexRef.current <= text.length) {
          timeoutRef.current = setTimeout(type, speed);
        } else {
          setIsTyping(false);
          onComplete?.();
        }
      }
    };

    // Reset if text changes
    if (text !== displayedText) {
      if (displayedText.length > text.length || !isTyping) {
        indexRef.current = 0;
        setDisplayedText('');
      }
    }

    if (isTyping && text.length > displayedText.length) {
      timeoutRef.current = setTimeout(type, speed);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, isTyping, speed, prefersReducedMotion, onComplete, displayedText]);

  return (
    <div className={cn('relative', className)}>
      <span>{displayedText}</span>
      {isTyping && (
        <span className="animate-pulse ml-0.5 inline-block w-2 h-5 bg-accent-cyan" />
      )}
    </div>
  );
};

interface StreamingTextProps {
  chunks: string[];
  isStreaming?: boolean;
  onComplete?: () => void;
  className?: string;
}

/**
 * Streaming Text Component
 * Renders text chunks as they arrive, with smooth animation
 * Ideal for real-time API responses
 */
export const StreamingText: React.FC<StreamingTextProps> = ({
  chunks,
  isStreaming = false,
  onComplete,
  className,
}) => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div className={cn('space-y-1', className)}>
      {chunks.map((chunk, idx) => (
        <div
          key={idx}
          className={cn(
            'inline',
            'transition-all duration-300 ease-out',
            prefersReducedMotion ? '' : 'animate-fade-in'
          )}
          style={{
            animationDelay: prefersReducedMotion ? '0ms' : `${idx * 50}ms`,
          }}
        >
          {chunk}
          {idx === chunks.length - 1 && isStreaming && (
            <span className="animate-pulse ml-1 inline-block w-2 h-4 bg-accent-cyan" />
          )}
        </div>
      ))}
      {!isStreaming && chunks.length > 0 && onComplete && (
        <span ref={() => { onComplete(); }} style={{ display: 'none' }} />
      )}
    </div>
  );
};

interface MarkdownLikeTextProps {
  text: string;
  isStreaming?: boolean;
  className?: string;
}

/**
 * Markdown-like Text Component
 * Renders text with basic markdown support and streaming
 */
export const MarkdownLikeText: React.FC<MarkdownLikeTextProps> = ({
  text,
  isStreaming = false,
  className,
}) => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Simple markdown parsing
  const renderMarkdown = (content: string) => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    const boldRegex = /\*\*(.*?)\*\*/g;
    const _italicRegex = /\*(.*?)\*/g;
    const codeRegex = /`(.*?)`/g;

    let match;
    const matches: { regex: RegExp; type: 'bold' | 'code'; start: number; end: number; content: string }[] = [];

    // Find bold matches
    while ((match = boldRegex.exec(content)) !== null) {
      matches.push({ regex: boldRegex, type: 'bold', start: match.index, end: boldRegex.lastIndex, content: match[1] });
    }

    // Find code matches
    while ((match = codeRegex.exec(content)) !== null) {
      matches.push({ regex: codeRegex, type: 'code', start: match.index, end: codeRegex.lastIndex, content: match[1] });
    }

    // Sort matches by position
    matches.sort((a, b) => a.start - b.start);

    // Build rendered parts
    lastIndex = 0;
    matches.forEach(({ start, end, type, content }) => {
      if (lastIndex < start) {
        parts.push(content.substring(lastIndex, start));
      }

      if (type === 'bold') {
        parts.push(<strong key={`bold-${start}`}>{content}</strong>);
      } else if (type === 'code') {
        parts.push(
          <code key={`code-${start}`} className="bg-slate-800/50 px-1.5 py-0.5 rounded text-accent-cyan text-xs">
            {content}
          </code>
        );
      }

      lastIndex = end;
    });

    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }

    return parts.length > 0 ? parts : content;
  };

  return (
    <div
      className={cn(
        'text-sm leading-relaxed whitespace-pre-wrap break-words',
        !prefersReducedMotion && 'animate-fade-in',
        className
      )}
    >
      {renderMarkdown(text)}
      {isStreaming && <span className="animate-pulse ml-1 inline-block w-2 h-4 bg-accent-cyan" />}
    </div>
  );
};
