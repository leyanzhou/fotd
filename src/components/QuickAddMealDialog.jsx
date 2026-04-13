import { useRef, useState } from 'react';

const DEFAULT_FORM = {
  mealType: 'breakfast',
  text: '',
  imageUrl: '',
};

async function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Unable to read image file.'));
    reader.readAsDataURL(file);
  });
}

export function QuickAddMeal({ onAddMeal }) {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const resetForm = () => {
    setForm(DEFAULT_FORM);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const closeDialog = () => {
    setIsOpen(false);
    setError('');
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const imageUrl = await fileToDataUrl(file);
      updateField('imageUrl', imageUrl);
      setError('');
    } catch (readError) {
      setError(readError.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      await onAddMeal({
        mealType: form.mealType,
        text: form.text.trim(),
        imageUrl: form.imageUrl,
      });

      resetForm();
      closeDialog();
    } catch (submitError) {
      setError(submitError.message || 'Unable to save meal.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <button className="quick-add-button" onClick={() => setIsOpen(true)} type="button">
        + Log meal
      </button>

      {isOpen ? (
        <div className="modal-backdrop" onClick={closeDialog} role="presentation">
          <section
            className="modal card"
            onClick={(event) => event.stopPropagation()}
            aria-label="Add a meal"
          >
            <div className="modal-header">
              <div>
                <p className="eyebrow">Quick Log</p>
                <h2>Add a meal in seconds</h2>
              </div>
              <button
                className="icon-button"
                onClick={closeDialog}
                type="button"
                aria-label="Close add meal dialog"
              >
                x
              </button>
            </div>

            <form className="meal-form" onSubmit={handleSubmit}>
              <label>
                Meal type
                <select
                  value={form.mealType}
                  onChange={(event) => updateField('mealType', event.target.value)}
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                </select>
              </label>

              <label>
                Description
                <textarea
                  placeholder="Optional note, like oats and berries"
                  rows="3"
                  value={form.text}
                  onChange={(event) => updateField('text', event.target.value)}
                />
              </label>

              <label>
                Photo
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>

              {form.imageUrl ? (
                <div className="image-preview-wrap">
                  <img className="image-preview" src={form.imageUrl} alt="Meal preview" />
                  <button
                    className="text-button"
                    type="button"
                    onClick={() => {
                      updateField('imageUrl', '');
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                  >
                    Remove image
                  </button>
                </div>
              ) : null}

              {error ? <p className="error-text">{error}</p> : null}

              <div className="modal-actions">
                <button className="secondary-button" onClick={closeDialog} type="button">
                  Cancel
                </button>
                <button className="primary-button" disabled={isSaving} type="submit">
                  {isSaving ? 'Saving...' : 'Save meal'}
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </>
  );
}
