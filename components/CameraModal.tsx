import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Image: string) => void;
  language: Language;
}

export const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  onCapture,
  language
}) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [countdownDuration, setCountdownDuration] = useState<0 | 3 | 5>(3);
  const [mirror, setMirror] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isShutterFlashing, setIsShutterFlashing] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nativeInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const countdownTimerRef = useRef<number | null>(null);

  const currentT = (TRANSLATIONS[language] as any) || TRANSLATIONS.EN;

  // Stop active stream safely
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        try {
          track.stop();
        } catch (e) {
          console.warn('Track stop error:', e);
        }
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
  }, []);

  // Check if multiple camera devices exist
  useEffect(() => {
    if (navigator.mediaDevices?.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices().then(devices => {
        const videoDevices = devices.filter(d => d.kind === 'videoinput');
        setHasMultipleCameras(videoDevices.length > 1);
      }).catch(() => {});
    }
  }, []);

  // Start live camera stream with multi-tiered constraint fallback
  const startCamera = useCallback(async () => {
    stopStream();
    setCameraError(null);
    setIsLoading(true);

    if (!navigator.mediaDevices?.getUserMedia) {
      setIsLoading(false);
      setCameraError(currentT.cameraError || 'Camera API is not supported on this browser.');
      return;
    }

    let mediaStream: MediaStream | null = null;
    let lastError: any = null;

    // Constraint tiers: high quality -> basic facingMode -> any video
    const attempts = [
      {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      },
      {
        video: {
          facingMode: facingMode
        },
        audio: false
      },
      {
        video: true,
        audio: false
      }
    ];

    for (const constraints of attempts) {
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        if (mediaStream) break;
      } catch (err: any) {
        lastError = err;
      }
    }

    if (!mediaStream) {
      setIsLoading(false);
      console.error('All camera attempts failed:', lastError);
      if (lastError?.name === 'NotAllowedError' || lastError?.name === 'PermissionDeniedError') {
        setCameraError(currentT.cameraPermissionDenied || 'Camera permission denied. Please allow camera access in browser settings or use the system camera below.');
      } else if (lastError?.name === 'NotFoundError' || lastError?.name === 'DevicesNotFoundError') {
        setCameraError(currentT.cameraNotFound || 'No camera device found on your device.');
      } else {
        setCameraError(currentT.cameraError || 'Unable to open camera stream. Try using the system camera.');
      }
      return;
    }

    streamRef.current = mediaStream;

    if (videoRef.current) {
      const video = videoRef.current;
      video.srcObject = mediaStream;
      video.muted = true;
      video.setAttribute('playsinline', 'true');
      video.setAttribute('webkit-playsinline', 'true');

      video.onloadedmetadata = () => {
        video.play().then(() => {
          setIsStreaming(true);
          setIsLoading(false);
        }).catch((e) => {
          console.warn('Video play interrupted:', e);
          setIsStreaming(true);
          setIsLoading(false);
        });
      };
    } else {
      setIsStreaming(true);
      setIsLoading(false);
    }
  }, [facingMode, currentT, stopStream]);

  // Handle modal lifecycle without dependency loop
  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopStream();
      if (countdownTimerRef.current) {
        window.clearInterval(countdownTimerRef.current);
        countdownTimerRef.current = null;
      }
      setCountdown(null);
      setCameraError(null);
    }

    return () => {
      stopStream();
      if (countdownTimerRef.current) {
        window.clearInterval(countdownTimerRef.current);
        countdownTimerRef.current = null;
      }
    };
  }, [isOpen, facingMode, startCamera, stopStream]);

  // Take the snapshot from video
  const captureFrame = useCallback(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');

    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (mirror && facingMode === 'user') {
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, width, height);

    // Trigger visual flash
    setIsShutterFlashing(true);
    setTimeout(() => setIsShutterFlashing(false), 200);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    stopStream();
    onCapture(dataUrl);
    onClose();
  }, [mirror, facingMode, stopStream, onCapture, onClose]);

  const handleShutterClick = () => {
    if (countdown !== null) return;

    if (countdownDuration === 0) {
      captureFrame();
      return;
    }

    let remaining = countdownDuration;
    setCountdown(remaining);

    countdownTimerRef.current = window.setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        if (countdownTimerRef.current) {
          window.clearInterval(countdownTimerRef.current);
          countdownTimerRef.current = null;
        }
        setCountdown(null);
        captureFrame();
      } else {
        setCountdown(remaining);
      }
    }, 1000);
  };

  const handleCancelCountdown = () => {
    if (countdownTimerRef.current) {
      window.clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    setCountdown(null);
  };

  const toggleFacingMode = () => {
    setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'));
  };

  // Handle native camera capture (system camera input)
  const handleNativeCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        stopStream();
        onCapture(reader.result as string);
        onClose();
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-3 sm:p-6 animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-slate-950 rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/60 backdrop-blur-md z-20">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isStreaming ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
            <h3 className="text-white font-black text-sm tracking-wide uppercase">
              {currentT.takeSelfie || '現場自拍'}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Direct Native Camera trigger button */}
            <button
              type="button"
              onClick={() => nativeInputRef.current?.click()}
              title="Open System Camera"
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold transition-all"
            >
              <span>📱</span>
              <span className="hidden sm:inline">系統相機</span>
            </button>

            {/* Countdown toggle */}
            <div className="flex bg-white/10 rounded-xl p-1 text-[11px] font-bold text-white">
              <button
                type="button"
                onClick={() => setCountdownDuration(0)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  countdownDuration === 0 ? 'bg-red-600 text-white shadow' : 'text-white/60 hover:text-white'
                }`}
              >
                0s
              </button>
              <button
                type="button"
                onClick={() => setCountdownDuration(3)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  countdownDuration === 3 ? 'bg-red-600 text-white shadow' : 'text-white/60 hover:text-white'
                }`}
              >
                3s
              </button>
              <button
                type="button"
                onClick={() => setCountdownDuration(5)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  countdownDuration === 5 ? 'bg-red-600 text-white shadow' : 'text-white/60 hover:text-white'
                }`}
              >
                5s
              </button>
            </div>

            {/* Mirror toggle for selfie */}
            {facingMode === 'user' && (
              <button
                type="button"
                onClick={() => setMirror(!mirror)}
                title="Toggle Mirror"
                className={`p-2 rounded-xl text-xs font-bold transition-all ${
                  mirror ? 'bg-white/20 text-white' : 'bg-transparent text-white/50 hover:text-white'
                }`}
              >
                🪞
              </button>
            )}

            {/* Flip Camera */}
            {hasMultipleCameras && (
              <button
                type="button"
                onClick={toggleFacingMode}
                title="Flip Camera"
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
              >
                🔄
              </button>
            )}

            {/* Close */}
            <button
              type="button"
              onClick={() => {
                handleCancelCountdown();
                stopStream();
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold transition-all ml-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Viewfinder area */}
        <div className="relative aspect-[4/3] w-full bg-black flex items-center justify-center overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center gap-3 z-30">
              <div className="w-10 h-10 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin"></div>
              <p className="text-white/70 text-xs font-bold">啟動相機中...</p>
            </div>
          )}

          {cameraError ? (
            <div className="p-8 text-center max-w-md space-y-4 z-20">
              <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-400 mx-auto flex items-center justify-center text-3xl">
                📸
              </div>
              <p className="text-white text-sm font-medium leading-relaxed">
                {cameraError}
              </p>
              <div className="pt-2 flex flex-col gap-2.5">
                {/* Direct system camera trigger */}
                <button
                  type="button"
                  onClick={() => nativeInputRef.current?.click()}
                  className="px-6 py-3 bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-red-700 transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
                >
                  <span>📱</span>
                  <span>使用系統相機拍照</span>
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={startCamera}
                    className="flex-1 px-4 py-2.5 bg-white/10 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-white/20 transition-all"
                  >
                    {currentT.tryAgain || '重試'}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 bg-white/10 text-white/80 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-white/20 transition-all"
                  >
                    {currentT.useFileUpload || '從檔案上傳'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover transition-transform ${
                  mirror && facingMode === 'user' ? 'scale-x-[-1]' : ''
                }`}
              />

              {/* Viewfinder Framing Guidelines */}
              <div className="absolute inset-8 pointer-events-none border border-white/20 rounded-3xl flex flex-col justify-between p-4">
                <div className="flex justify-between">
                  <div className="w-4 h-4 border-t-2 border-l-2 border-white/60"></div>
                  <div className="w-4 h-4 border-t-2 border-r-2 border-white/60"></div>
                </div>
                {/* Center face guide */}
                <div className="w-32 h-44 border border-dashed border-white/30 rounded-full mx-auto opacity-40"></div>
                <div className="flex justify-between">
                  <div className="w-4 h-4 border-b-2 border-l-2 border-white/60"></div>
                  <div className="w-4 h-4 border-b-2 border-r-2 border-white/60"></div>
                </div>
              </div>

              {/* Countdown overlay */}
              {countdown !== null && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex flex-col items-center justify-center z-30">
                  <div className="text-8xl font-black text-white drop-shadow-[0_4px_20px_rgba(239,68,68,0.8)] animate-ping">
                    {countdown}
                  </div>
                  <button
                    type="button"
                    onClick={handleCancelCountdown}
                    className="mt-6 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* Shutter flash */}
              {isShutterFlashing && (
                <div className="absolute inset-0 bg-white z-40 animate-out fade-out duration-200"></div>
              )}
            </>
          )}
        </div>

        {/* Shutter Bar */}
        <div className="p-6 bg-slate-900/90 border-t border-white/10 flex items-center justify-center gap-6">
          {!cameraError && (
            <button
              type="button"
              onClick={handleShutterClick}
              disabled={countdown !== null || isLoading}
              className="relative group p-1.5 rounded-full border-4 border-white/80 hover:border-red-500 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
              title="Take Photo"
            >
              <div className="w-16 h-16 rounded-full bg-red-600 group-hover:bg-red-500 flex items-center justify-center text-white text-2xl shadow-lg shadow-red-600/50 transition-colors">
                📸
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Hidden system camera file input */}
      <input
        type="file"
        ref={nativeInputRef}
        onChange={handleNativeCapture}
        accept="image/*"
        capture="user"
        className="hidden"
      />
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
