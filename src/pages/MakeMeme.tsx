import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Camera from '@/components/Camera';
import memeApiService from '@/lib/memeApi';
import { pickMemeWithOpenAI } from '@/lib/genai';
import { analyzeImage, pickTemplateLocally } from '@/lib/localVision';

const MakeMeme = () => {
  const navigate = useNavigate();

  const handleCapture = useCallback(async (imageSrc: string) => {
    // Convert data URL to File for consistency
    const res = await fetch(imageSrc);
    const blob = await res.blob();
    const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });

    try {
      const candidates = await memeApiService.getMemeTemplates();
      const unique = Array.from(new Map(candidates.map(c => [c.id, c])).values());
      // Local analysis first
      const analysis = await analyzeImage(imageSrc);
      let template = pickTemplateLocally(unique.map(c => ({ id: c.id, name: c.name, imageUrl: c.imageUrl })), analysis);
      // If OpenAI key is present, refine choice
      try {
        const picked = await pickMemeWithOpenAI('funny, viral, gen z', unique.map(c => ({ id: c.id, name: c.name, imageUrl: c.imageUrl })), `faces:${analysis.faces} bright:${analysis.brightness.toFixed(2)} contrast:${analysis.contrast.toFixed(2)}`);
        // Only override local pick if OpenAI returns a valid different template
        if (picked && picked.id !== template.id) template = picked;
      } catch {}
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
      try {
        const candidates = await memeApiService.getMemeTemplates();
        const unique = Array.from(new Map(candidates.map(c => [c.id, c])).values());
        const template = unique.length ? unique[Math.floor(Math.random() * unique.length)] : unique[0];
        const result = {
          userPhoto: imageSrc,
          memeTemplate: template!,
          caption: `This pic is giving *${template?.name}* energy 👀`,
          confidence: 80,
          matchReason: 'Fallback selection'
        };
        sessionStorage.setItem('memeResult', JSON.stringify(result));
        navigate('/results');
      } catch {
        console.error(e);
        navigate('/');
      }
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

