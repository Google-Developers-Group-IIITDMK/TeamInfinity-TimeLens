import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Camera from '@/components/Camera';
import memeApiService from '@/lib/memeApi';
import { pickMemeWithOpenAI } from '@/lib/genai';

const MakeMeme = () => {
  const navigate = useNavigate();

  const handleCapture = useCallback(async (imageSrc: string) => {
    // Convert data URL to File for consistency
    const res = await fetch(imageSrc);
    const blob = await res.blob();
    const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });

    try {
      const candidates = await memeApiService.getMemeTemplates();
      const description = 'captured selfie or person photo';
      const picked = await pickMemeWithOpenAI('funny, viral, gen z', candidates.map(c => ({ id: c.id, name: c.name, imageUrl: c.imageUrl })), description);
      const template = picked ? candidates.find(c => c.id === picked.id) || candidates[0] : candidates[0];
      const result = {
        userPhoto: imageSrc,
        memeTemplate: template!,
        caption: `This pic is giving *${template?.name}* energy 👀`,
        confidence: 90,
        matchReason: 'Selected via OpenAI scoring among known templates'
      };
      sessionStorage.setItem('memeResult', JSON.stringify(result));
      navigate('/results');
    } catch (e) {
      console.error(e);
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-dark-bg text-white pt-20 px-4">
      <div className="max-w-3xl mx-auto">
        <Camera onCapture={handleCapture} />
      </div>
    </div>
  );
};

export default MakeMeme;

