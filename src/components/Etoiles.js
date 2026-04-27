'use client';
import { useState } from 'react';
import { Star } from 'lucide-react';

export default function Etoiles({ note = 0, taille = 20, modifiable = false, onChange = null }) {
  const [survol, setSurvol] = useState(0);

  const noteAffichee = modifiable ? (survol || note) : note;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((etoile) => (
        <button
          key={etoile}
          type="button"
          disabled={!modifiable}
          onClick={() => modifiable && onChange && onChange(etoile)}
          onMouseEnter={() => modifiable && setSurvol(etoile)}
          onMouseLeave={() => modifiable && setSurvol(0)}
          className={modifiable ? 'cursor-pointer' : 'cursor-default'}
        >
          <Star
            size={taille}
            className={`transition ${
              etoile <= noteAffichee
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
}
