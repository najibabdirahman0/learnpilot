import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface GeodeticSphereProps {
  isActive: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  className?: string;
}

export default function GeodeticSphere({ 
  isActive, 
  isSpeaking, 
  isListening, 
  className = '' 
}: GeodeticSphereProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 30;

    // Generate geodesic sphere vertices (more detailed)
    const generateGeodesicVertices = () => {
      const vertices = [];
      const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio
      
      // Create icosahedron vertices
      const t = 1.0;
      vertices.push(
        [-t, phi, 0], [t, phi, 0], [-t, -phi, 0], [t, -phi, 0],
        [0, -t, phi], [0, t, phi], [0, -t, -phi], [0, t, -phi],
        [phi, 0, -t], [phi, 0, t], [-phi, 0, -t], [-phi, 0, t]
      );

      // Add more vertices for denser mesh
      const additionalVertices = [];
      for (let i = 0; i < vertices.length; i++) {
        for (let j = i + 1; j < vertices.length; j++) {
          const v1 = vertices[i];
          const v2 = vertices[j];
          const distance = Math.sqrt(
            Math.pow(v1[0] - v2[0], 2) + 
            Math.pow(v1[1] - v2[1], 2) + 
            Math.pow(v1[2] - v2[2], 2)
          );
          
          if (distance < 2.5) { // Only add midpoints for close vertices
            const midpoint = [
              (v1[0] + v2[0]) / 2,
              (v1[1] + v2[1]) / 2,
              (v1[2] + v2[2]) / 2
            ];
            additionalVertices.push(midpoint);
          }
        }
      }
      
      vertices.push(...additionalVertices);

      // Normalize all vertices to unit sphere
      return vertices.map(v => {
        const length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
        return [v[0] / length, v[1] / length, v[2] / length];
      });
    };

    // Generate triangular mesh for wireframe
    const generateTriangularMesh = (vertices: number[][]) => {
      const triangles = [];
      
      // Create triangular faces for geodesic pattern
      for (let i = 0; i < vertices.length; i++) {
        for (let j = i + 1; j < vertices.length; j++) {
          for (let k = j + 1; k < vertices.length; k++) {
            const v1 = vertices[i];
            const v2 = vertices[j];
            const v3 = vertices[k];
            
            // Check if vertices form a reasonable triangle
            const d12 = Math.sqrt(Math.pow(v1[0] - v2[0], 2) + Math.pow(v1[1] - v2[1], 2) + Math.pow(v1[2] - v2[2], 2));
            const d23 = Math.sqrt(Math.pow(v2[0] - v3[0], 2) + Math.pow(v2[1] - v3[1], 2) + Math.pow(v2[2] - v3[2], 2));
            const d31 = Math.sqrt(Math.pow(v3[0] - v1[0], 2) + Math.pow(v3[1] - v1[1], 2) + Math.pow(v3[2] - v1[2], 2));
            
            // Only add triangles with reasonable edge lengths
            if (d12 < 1.2 && d23 < 1.2 && d31 < 1.2) {
              triangles.push([i, j], [j, k], [k, i]);
            }
          }
        }
      }
      
      return triangles;
    };

    const vertices = generateGeodesicVertices();
    const edges = generateTriangularMesh(vertices);
    let rotation = 0;
    let pulsePhase = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      rotation += 0.008; // Slower rotation
      pulsePhase += 0.05;

      // Calculate pulse intensity and color based on state
      let pulseIntensity = 0.1;
      let color = '#9CA3AF'; // Gray-400
      let lineWidth = 1;
      
      if (isSpeaking) {
        pulseIntensity = 0.4 + Math.sin(pulsePhase * 4) * 0.3;
        color = '#60A5FA'; // Blue-400
        lineWidth = 1.5;
      } else if (isListening) {
        pulseIntensity = 0.3 + Math.sin(pulsePhase * 3) * 0.2;
        color = '#34D399'; // Green-400
        lineWidth = 1.2;
      } else if (isActive) {
        pulseIntensity = 0.15 + Math.sin(pulsePhase * 1.5) * 0.1;
        color = '#A78BFA'; // Purple-400
      }

      // Apply rotations
      const rotateY = (vertex: number[]) => {
        const cos = Math.cos(rotation);
        const sin = Math.sin(rotation);
        return [
          vertex[0] * cos - vertex[2] * sin,
          vertex[1],
          vertex[0] * sin + vertex[2] * cos
        ];
      };

      const rotateX = (vertex: number[]) => {
        const cos = Math.cos(rotation * 0.6);
        const sin = Math.sin(rotation * 0.6);
        return [
          vertex[0],
          vertex[1] * cos - vertex[2] * sin,
          vertex[1] * sin + vertex[2] * cos
        ];
      };

      // Transform vertices
      const transformedVertices = vertices.map(v => rotateX(rotateY(v)));

      // Draw wireframe with triangular pattern
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.globalAlpha = 0.7 + pulseIntensity * 0.3;

      // Draw edges
      const drawnEdges = new Set();
      edges.forEach(edge => {
        const edgeKey = `${Math.min(edge[0], edge[1])}-${Math.max(edge[0], edge[1])}`;
        if (drawnEdges.has(edgeKey)) return;
        drawnEdges.add(edgeKey);

        const v1 = transformedVertices[edge[0]];
        const v2 = transformedVertices[edge[1]];

        if (!v1 || !v2) return;

        // Only draw edges that are facing towards us (simple back-face culling)
        const midpoint = [(v1[0] + v2[0]) / 2, (v1[1] + v2[1]) / 2, (v1[2] + v2[2]) / 2];
        if (midpoint[2] < -0.3) return; // Skip back-facing edges

        // Project to 2D with perspective
        const scale = radius * (1 + pulseIntensity * 0.2);
        const perspective = 1 / (1 + v1[2] * 0.3);
        const perspective2 = 1 / (1 + v2[2] * 0.3);
        
        const x1 = centerX + v1[0] * scale * perspective;
        const y1 = centerY + v1[1] * scale * perspective;
        const x2 = centerX + v2[0] * scale * perspective2;
        const y2 = centerY + v2[1] * scale * perspective2;

        // Vary line opacity based on depth
        const depth = (v1[2] + v2[2]) / 2;
        ctx.globalAlpha = (0.3 + (depth + 1) * 0.4) * (0.7 + pulseIntensity * 0.3);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      });

      // Add subtle glow effect for active states
      if (isSpeaking || isListening) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 15 + pulseIntensity * 20;
        ctx.globalAlpha = 0.2;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * (1 + pulseIntensity * 0.1), 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.shadowBlur = 0;
      }

      // Add center dot for reference
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 2, 0, Math.PI * 2);
      ctx.fill();

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, isSpeaking, isListening]);

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        width={300}
        height={300}
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 0 20px rgba(156, 163, 175, 0.3))' }}
      />
    </div>
  );
}