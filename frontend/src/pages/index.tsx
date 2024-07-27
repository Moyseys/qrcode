import { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';

const Home = () => {
  const [text, setText] = useState<string>('');
  const [size, setSize] = useState<number>(256);
  const [color, setColor] = useState<string>('#000000'); // Cor do QR Code
  const [bgColor, setBgColor] = useState<string>('#ffffff'); // Cor de fundo do QR Code
  const [borderColor, setBorderColor] = useState<string>('#000000'); // Cor da borda
  const [textColor, setTextColor] = useState<string>('#ffffff'); // Cor do texto
  const [canvasText, setCanvasText] = useState<string>('Escanei-me');
  const [showText, setShowText] = useState<boolean>(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (text.trim() === '') return;
    generateQRCode();
  }, [text, size, color, bgColor, borderColor, textColor, showText, canvasText]);

  const generateQRCode = async () => {
    if (size < 100 || size > 1000) {
      console.error('O tamanho deve estar entre 100 e 1000');
      return;
    }
    try {
      const options = {
        width: size,
        color: {
          dark: color,
          light: bgColor,
        },
      };
      const url = await QRCode.toDataURL(text, options);
      drawCanvas(url);
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
    }
  };

  const drawCanvas = (qrCodeUrl: string) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const borderPadding = 5;
        const borderRadius = 15;
        const qrX = 10;
        const qrY = 10;
        const qrSize = size;
        const text = canvasText;

        const qrImage = new Image();
        qrImage.src = qrCodeUrl;
        qrImage.onload = () => {
          ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);

          if (showText) {
            drawText(ctx, qrSize, text, canvas);
          }

          drawBorder(ctx, canvas);
        };
      }
    }
  };

  const drawText = (ctx: CanvasRenderingContext2D, qrSize: number, text: string, canvas: HTMLCanvasElement) => {
    ctx.font = '20px Arial';
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';

    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const textHeight = 20;
    const rectY = qrSize + 20;
    const rectHeight = canvas.height - rectY - 5;
    const rectWidth = canvas.width - 10;

    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.moveTo(5 + 15, rectY);
    ctx.lineTo(canvas.width - 5 - 15, rectY);
    ctx.arcTo(canvas.width - 5, rectY, canvas.width - 5, rectY + 15, 15);
    ctx.lineTo(canvas.width - 5, rectY + rectHeight - 15);
    ctx.arcTo(canvas.width - 5, rectY + rectHeight, canvas.width - 5 - 15, rectY + rectHeight, 15);
    ctx.lineTo(5 + 15, rectY + rectHeight);
    ctx.arcTo(5, rectY + rectHeight, 5, rectY + rectHeight - 15, 15);
    ctx.lineTo(5, rectY + 15);
    ctx.arcTo(5, rectY, 5 + 15, rectY, 15);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = textColor;
    const textX = canvas.width / 2;
    const textY = rectY + rectHeight / 2 + textHeight / 2;
    ctx.fillText(text, textX, textY);
  };

  const drawBorder = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const borderX = 5;
    const borderY = 5;
    const borderWidth = canvas.width - 10;
    const borderHeight = canvas.height - 10;

    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 5;

    ctx.beginPath();
    ctx.moveTo(borderX + 15, borderY);
    ctx.lineTo(borderX + borderWidth - 15, borderY);
    ctx.arcTo(borderX + borderWidth, borderY, borderX + borderWidth, borderY + 15, 15);
    ctx.lineTo(borderX + borderWidth, borderY + borderHeight - 15);
    ctx.arcTo(borderX + borderWidth, borderY + borderHeight, borderX + borderWidth - 15, borderY + borderHeight, 15);
    ctx.lineTo(borderX + 15, borderY + borderHeight);
    ctx.arcTo(borderX, borderY + borderHeight, borderX, borderY + borderHeight - 15, 15);
    ctx.lineTo(borderX, borderY + 15);
    ctx.arcTo(borderX, borderY, borderX + 15, borderY, 15);
    ctx.closePath();
    ctx.stroke();
  };

  const exportToImage = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataURL = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'qrcode.png';
      link.click();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Gerador de QR Code</h1>
      <form className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <label htmlFor="text" className="block text-lg font-medium text-gray-700 mb-2">Texto para QR Code:</label>
        <input
          type="text"
          id="text"
          name="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          className="border border-gray-300 rounded-md p-2 w-full mb-4"
        />

        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={showText}
              onChange={(e) => setShowText(e.target.checked)}
              className="form-checkbox"
            />
            <span className="ml-2 text-lg font-medium text-gray-700">Mostrar Texto</span>
          </label>
        </div>

        {showText && (
          <>
            <label htmlFor="canvasText" className="block text-lg font-medium text-gray-700 mb-2">Texto no Canvas:</label>
            <input
              type="text"
              id="canvasText"
              name="canvasText"
              value={canvasText}
              onChange={(e) => setCanvasText(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full mb-4"
            />

            <label htmlFor="textColor" className="block text-lg font-medium text-gray-700 mb-2">Cor do Texto:</label>
            <input
              type="color"
              id="textColor"
              name="textColor"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full mb-4"
            />

            <label htmlFor="borderColor" className="block text-lg font-medium text-gray-700 mb-2">Cor da Borda:</label>
            <input
              type="color"
              id="borderColor"
              name="borderColor"
              value={borderColor}
              onChange={(e) => setBorderColor(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full mb-4"
            />
          </>
        )}

        <label htmlFor="size" className="block text-lg font-medium text-gray-700 mb-2">Tamanho do QR Code:</label>
        <input
          type="number"
          id="size"
          name="size"
          value={size}
          onChange={(e) => setSize(parseInt(e.target.value))}
          min="100"
          max="1000"
          className="border border-gray-300 rounded-md p-2 w-full mb-4"
        />

        <label htmlFor="color" className="block text-lg font-medium text-gray-700 mb-2">Cor do Código:</label>
        <input
          type="color"
          id="color"
          name="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full mb-4"
        />

        <label htmlFor="bgColor" className="block text-lg font-medium text-gray-700 mb-2">Cor de Fundo:</label>
        <input
          type="color"
          id="bgColor"
          name="bgColor"
          value={bgColor}
          onChange={(e) => setBgColor(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full mb-4"
        />

        <button
          type="button"
          onClick={exportToImage}
          className="bg-blue-500 text-white p-2 rounded-md w-full mt-4 hover:bg-blue-600"
        >
          Exportar como Imagem
        </button>
      </form>
      <div className="mt-6">
        <canvas ref={canvasRef} width={size + 20} height={size + 100} className="border border-gray-300 bg-white" />
      </div>
    </div>
  );
};

export default Home;
