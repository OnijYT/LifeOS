import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { HabitForm } from '../interfaces';
import axios from 'axios';
import { api } from '../api';
import s from './CreateHabit.module.css';

interface CreateHabitProps {
  onNavigate?: (page: string) => void;
}

const EMOJI_OPTIONS = [
  '💪', '📚', '🧘', '✍️', '💧', '🏃', '🎯', '🎵',
  '🍎', '😴', '🧹', '💊', '🚶', '🎨', '💻', '🌱',
  '☕', '🧠', '🏋️', '🚫', '✅', '⏰', '📝', '🧘‍♂️',
];

const COLOR_OPTIONS = [
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#22C55E' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Teal', value: '#14B8A6' },
  { name: 'Yellow', value: '#EAB308' },
];

function CreateHabit({ onNavigate }: CreateHabitProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState('💪');
  const [selectedColor, setSelectedColor] = useState('#8B5CF6');
  const { handleSubmit, register, reset, formState: { errors } } = useForm<HabitForm>();

  const onSubmitHabit = async (data: HabitForm) => {
    try {
      setIsLoading(true);
      await api.post('/habits/create-habit', {
        ...data,
        emodji: selectedEmoji,
      });
      reset();
      if (onNavigate) onNavigate('habits');
    } catch (err) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || 'Error creating habit');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={s.page}>
      {/* Background decoration */}
      <div className={s.bgOrb1} />
      <div className={s.bgOrb2} />

      <div className={s.container}>
        {/* Header */}
        <div className={s.header}>
          <button
            className={s.backBtn}
            onClick={() => onNavigate ? onNavigate('habits') : undefined}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back
          </button>
          <div className={s.headerText}>
            <h1 className={s.title}>Create New Habit</h1>
            <p className={s.subtitle}>Build a new routine that sticks</p>
          </div>
        </div>

        {/* Preview Card */}
        <div className={s.previewCard} style={{ '--accent': selectedColor } as React.CSSProperties}>
          <div className={s.previewIcon} style={{ background: `${selectedColor}20`, color: selectedColor }}>
            <span>{selectedEmoji}</span>
          </div>
          <div className={s.previewInfo}>
            <span className={s.previewLabel}>Preview</span>
            <span className={s.previewName}>Your habit name</span>
          </div>
          <div className={s.previewStreak}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            0 day streak
          </div>
        </div>

        {/* Form */}
        <form className={s.form} onSubmit={handleSubmit(onSubmitHabit)}>
          {/* Habit Name */}
          <div className={s.fieldGroup}>
            <label className={s.label} htmlFor="habit-title">Habit name</label>
            <div className={s.inputWrapper}>
              <input
                id="habit-title"
                type="text"
                className={`${s.input} ${errors.title ? s.inputError : ''}`}
                placeholder="e.g. Morning workout, Read 30 minutes..."
                {...register('title', { required: 'Habit name is required' })}
                autoFocus
              />
            </div>
            {errors.title && (
              <span className={s.errorText}>{errors.title.message}</span>
            )}
          </div>

          {/* Icon Picker */}
          <div className={s.fieldGroup}>
            <label className={s.label}>Choose an icon</label>
            <div className={s.emojiGrid}>
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  className={`${s.emojiBtn} ${selectedEmoji === emoji ? s.emojiBtnActive : ''}`}
                  onClick={() => setSelectedEmoji(emoji)}
                  style={selectedEmoji === emoji ? { borderColor: selectedColor, background: `${selectedColor}15` } : undefined}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Color Picker */}
          <div className={s.fieldGroup}>
            <label className={s.label}>Accent color</label>
            <div className={s.colorGrid}>
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  className={`${s.colorBtn} ${selectedColor === color.value ? s.colorBtnActive : ''}`}
                  onClick={() => setSelectedColor(color.value)}
                  style={{ background: color.value }}
                  title={color.name}
                >
                  {selectedColor === color.value && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className={s.tips}>
            <div className={s.tipsIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </div>
            <div className={s.tipsContent}>
              <span className={s.tipsTitle}>Tips for a great habit</span>
              <ul className={s.tipsList}>
                <li>Start small — consistency beats intensity</li>
                <li>Stack it on top of an existing routine</li>
                <li>Track your streak to stay motivated</li>
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className={s.actions}>
            <button
              type="button"
              className={s.cancelBtn}
              onClick={() => onNavigate ? onNavigate('habits') : undefined}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={s.submitBtn}
              disabled={isLoading}
              style={{ '--btn-bg': selectedColor } as React.CSSProperties}
            >
              {isLoading ? (
                <div className={s.spinner}>
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4 31.4" strokeLinecap="round" />
                  </svg>
                </div>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Create Habit
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateHabit;
