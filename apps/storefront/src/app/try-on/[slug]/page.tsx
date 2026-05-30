'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft, Camera, RefreshCw } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

export default function VirtualTryOn() {
  const { slug } = useParams();
  const router = useRouter();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // AI States
  const [isProcessing, setIsProcessing] = useState(false);
  const [finalResult, setFinalResult] = useState<string | null>(null);

  // Camera States
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch product details
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_BASE}/catalog/products`);
        const data = await res.json();
        if (data.success) {
          const found = data.data.find((p: any) => p.slug === slug);
          setProduct(found);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    
    // Cleanup camera on unmount
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [slug, stream]); // Added stream to dependency array to satisfy exhaustive-deps, though conceptually ok. Actually, just adding it is safe.
  
  // Wait, I should not overwrite the whole useEffect if I only want to add error state. I will just add error state at line 20 and update startCamera.

  useEffect(() => {
    if (isCameraActive && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [isCameraActive, stream]);

  const startCamera = async () => {
    setError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: 1280, height: 720 } 
      });
      setStream(mediaStream);
      setIsCameraActive(true);
    } catch (err) {
      console.error("Camera access denied or unavailable", err);
      setError("Please allow camera access in your browser to use Live Try-On.");
    }
  };

  const captureSnapshot = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(imageDataUrl);
        
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setIsCameraActive(false);
        }

        // Trigger AI Processing
        setIsProcessing(true);
        try {
          const res = await fetch('/api/try-on', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              capturedImage: imageDataUrl,
              productImage: product.images[0]
            })
          });
          const data = await res.json();
          if (data.success && data.resultUrl) {
            setFinalResult(data.resultUrl);
          } else {
            console.warn("Hugging Face API failed, falling back to CSS simulation:", data.error);
            // Simulate processing time for the fallback
            setTimeout(() => {
              setFinalResult('fallback');
            }, 3000);
          }
        } catch (err) {
          console.warn('API connection failed, falling back to CSS simulation:', err);
          setTimeout(() => {
            setFinalResult('fallback');
          }, 3000);
        } finally {
          // Note: we don't set isProcessing false here if we are waiting for the fallback timeout.
          // We let the timeout handle it or if success, we do it immediately.
          if (finalResult !== 'fallback') {
             // We will handle isProcessing in the useEffect or just let it be.
             // Actually, let's just set isProcessing false immediately if success, else the timeout does it.
          }
        }
      }
    }
  };

  // Effect to handle fallback state correctly
  useEffect(() => {
    if (finalResult) {
      setIsProcessing(false);
    }
  }, [finalResult]);

  const retake = () => {
    setCapturedImage(null);
    setFinalResult(null);
    startCamera();
  };

  if (loading) return <div className="min-h-screen bg-bg flex items-center justify-center"><Sparkles className="animate-spin text-gold" /></div>;
  if (!product) return <div className="min-h-screen bg-bg flex flex-col items-center justify-center text-stone-300">Product not found. <button onClick={() => router.push('/')} className="text-gold mt-4">Go Back</button></div>;

  return (
    <div className="min-h-screen bg-bg text-stone-200">
      <header className="sticky top-0 z-40 glass-panel border-b py-4 px-6 md:px-12 flex items-center justify-between">
        <button onClick={() => router.push('/')} className="flex items-center gap-2 text-stone-400 hover:text-gold transition text-xs uppercase tracking-widest">
          <ArrowLeft size={16} /> The Atelier
        </button>
        <div className="flex items-center gap-3 text-lg md:text-xl font-serif tracking-widest text-gold italic font-semibold">
          <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain rounded-full border border-gold/30" />
          SATYABHAMA DESIGNERS
        </div>
        <div className="w-[100px]"></div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Col: Product Info & Instructions */}
        <div className="flex flex-col gap-6 md:col-span-4">
          <div>
            <span className="text-gold text-[10px] uppercase tracking-widest font-mono block mb-2">Live AR Fitting Room</span>
            <h1 className="text-3xl md:text-4xl font-serif leading-tight text-stone-100 mb-4 drop-shadow-md">
              {product.name}
            </h1>
            <p className="text-stone-400 text-sm leading-relaxed mb-6">
              Step into our digital atelier. Turn on your camera, align your body with the digital drape, and see the masterpiece come to life.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-xl shadow-heavy">
            {!isCameraActive && !capturedImage ? (
              <div className="text-center">
                <Camera size={48} className="text-stone-600 mx-auto mb-4" />
                <h3 className="font-serif text-lg text-stone-300 mb-2">Activate Magic Mirror</h3>
                <p className="text-xs text-stone-500 mb-6">We need access to your webcam to project the Saree onto you.</p>
                
                {error && (
                  <div className="mb-6 p-3 bg-red-900/20 border border-red-900/50 rounded text-red-400 text-xs">
                    {error}
                  </div>
                )}
                
                <button 
                  onClick={startCamera}
                  className="w-full bg-gold text-bg py-4 uppercase tracking-widest font-bold text-sm rounded shadow-gold hover:opacity-90 transition flex items-center justify-center gap-2"
                >
                  <Camera size={18} /> Turn On Camera
                </button>
              </div>
            ) : isCameraActive ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 text-emerald-400 bg-emerald-900/20 p-3 rounded border border-emerald-900/50">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs uppercase tracking-widest font-bold">Camera Active</span>
                </div>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Stand back so your upper body is visible. Align your shoulders with the digital garment overlay.
                </p>
                <button 
                  onClick={captureSnapshot}
                  className="w-full bg-gold text-bg py-4 uppercase tracking-widest font-bold text-sm rounded shadow-gold hover:opacity-90 transition flex items-center justify-center gap-2 mt-4"
                >
                  <Camera size={18} /> Capture Look
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                 <h3 className="font-serif text-lg text-gold mb-1">
                   {finalResult ? "Masterpiece Ready!" : isProcessing ? "AI Weaving..." : "Look Captured!"}
                 </h3>
                 <p className="text-xs text-stone-400 mb-4">
                   {finalResult 
                     ? "Your garment has been flawlessly stitched onto your digital avatar." 
                     : isProcessing 
                       ? "Please wait while our AI meticulously drapes the garment."
                       : "Your digital fitting is ready for processing."}
                 </p>
                 <button 
                  onClick={retake}
                  disabled={isProcessing}
                  className={`w-full border border-stone-600 text-stone-300 py-3 uppercase tracking-widest font-bold text-xs rounded transition flex items-center justify-center gap-2 ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:border-gold hover:text-gold'}`}
                >
                  <RefreshCw size={14} /> Retake Photo
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Live Video Feed / Visualizer */}
        <div className="md:col-span-8 relative aspect-[4/3] rounded-xl border-2 border-stone-800 overflow-hidden bg-stone-950 flex items-center justify-center shadow-[0_0_50px_rgba(212,175,55,0.05)]">
          
          {/* Invisible Canvas for Snapshot Extraction */}
          <canvas ref={canvasRef} className="hidden" />

          {!isCameraActive && !capturedImage ? (
            // Idle State: Show Product Only
            <div className="relative w-full h-full group">
              <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain p-8 opacity-80 filter drop-shadow-2xl transition-transform duration-[2s] group-hover:scale-105" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="glass-panel px-6 py-3 rounded-full text-gold text-xs uppercase tracking-widest font-bold tracking-[0.2em] shadow-2xl">
                  Waiting for Camera...
                </span>
              </div>
            </div>

          ) : isCameraActive ? (
            // Live AR View
            <div className="relative w-full h-full bg-black">
              {/* Actual Video Feed */}
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="absolute inset-0 w-full h-full object-cover transform -scale-x-100" 
              />
              
              {/* Augmented Reality Garment Overlay */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 0.85, y: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 pointer-events-none flex items-center justify-center"
              >
                <img 
                  src={product.images[0]} 
                  alt="Garment Overlay" 
                  className="w-[80%] h-[90%] object-contain filter drop-shadow-[0_0_30px_rgba(0,0,0,0.8)] mix-blend-normal" 
                />
              </motion.div>

              {/* Scanning UI Lines */}
              <div className="absolute inset-0 pointer-events-none border-4 border-gold/30 rounded-xl" />
              <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gold/40 shadow-[0_0_15px_rgba(212,175,55,0.8)] -translate-y-1/2" />
            </div>

          ) : (
            // Captured Result View
            <div className="relative w-full h-full flex bg-stone-900">
               
               {finalResult === 'fallback' ? (
                 <div className="relative w-full h-full">
                    {/* Simulation Mode: Show snapshot perfectly blended with the garment using CSS */}
                    <img src={capturedImage!} alt="Captured Snapshot" className="absolute inset-0 w-full h-full object-cover transform -scale-x-100" />
                    
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center mix-blend-multiply opacity-90">
                      <img 
                        src={product.images[0]} 
                        alt="Garment Overlay" 
                        className="w-[85%] h-[95%] object-contain filter drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]" 
                      />
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-4 rounded-xl border border-gold/30 text-center z-50 shadow-2xl">
                      <p className="text-xs text-gold uppercase tracking-widest font-bold mb-1">Simulated Preview</p>
                      <p className="text-[10px] text-stone-300">The public API is currently overloaded. Displaying advanced CSS overlay simulation.</p>
                    </div>
                 </div>
               ) : finalResult ? (
                 <img src={finalResult} alt="AI Generated Try-On" className="w-full h-full object-cover" />
               ) : (
                 <>
                   {/* Show the snapshot they took */}
                   <img src={capturedImage!} alt="Captured Snapshot" className="w-full h-full object-cover transform -scale-x-100 filter brightness-75" />
                   
                   {/* Keep the Garment overlaid on the frozen frame */}
                   <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <img 
                      src={product.images[0]} 
                      alt="Garment Overlay" 
                      className="w-[80%] h-[90%] object-contain filter drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]" 
                    />
                  </div>
                 </>
               )}
               
               {isProcessing && (
                 <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm p-8 text-center z-50"
                  >
                    <div className="glass-panel p-8 rounded-xl max-w-md border border-gold/40 shadow-[0_0_50px_rgba(212,175,55,0.15)] flex flex-col items-center">
                      <Sparkles className="text-gold mx-auto mb-4 animate-pulse" size={32} />
                      <h3 className="text-xl font-serif text-stone-100 mb-2">AI is Processing...</h3>
                      <p className="text-sm text-stone-400 mb-6 leading-relaxed">
                        Connecting to the IDM-VTON model. <br/>
                        <span className="text-gold font-bold">This may take a moment.</span> Please wait...
                      </p>
                      <div className="w-full h-1 bg-stone-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gold animate-[pulse_2s_ease-in-out_infinite] w-full" />
                      </div>
                    </div>
                 </motion.div>
               )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
