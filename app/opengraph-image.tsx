import { ImageResponse } from 'next/og';

// Configuración de la imagen (Estándar de Open Graph)
export const runtime = 'edge';
export const alt = 'Cristian SRC - Software Engineer - Full Stack Developer - Portfolio';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  // Colores de la página (coinciden con los estilos)
  const primaryColor = '#FFDB67'; // Color primary de la página (255, 219, 103)
  const blackColor = '#000000';
  const whiteColor = '#FFFFFF';
  const leftBgColor = '#FFF5E6'; // Naranja/durazno claro (izquierda)
  const rightBgColor = '#FFDB67'; // Amarillo suave (derecha)
  
  // Tecnologías a mostrar
  const technologies = [
    'Java (Spring Boot)',
    'Python (FastAPI)',
    'React',
    'Liferay',
    'SQL',
    'AWS'
  ];
  
  // Cargar la foto del usuario desde la URL pública
  let profileImage: string | null = null;
  try {
    // En desarrollo, usar localhost; en producción usar la URL del sitio
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const imageUrl = `${baseUrl}/images/foto.png`;
    const response = await fetch(imageUrl);
    if (response.ok) {
      const arrayBuffer = await response.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      // Convertir a base64 usando btoa (compatible con edge runtime)
      // Usar Array.from para evitar problemas con spread operator
      const binary = Array.from(uint8Array, byte => String.fromCharCode(byte)).join('');
      const base64 = btoa(binary);
      profileImage = `data:image/png;base64,${base64}`;
    }
  } catch (error) {
    // Si falla, simplemente no mostrar la imagen
    console.error('Error loading profile image:', error);
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          overflow: 'hidden',
        }}
      >
        {/* Fondo dividido: izquierda naranja, derecha amarilla */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '65%',
            height: '100%',
            background: leftBgColor,
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: '35%',
            height: '100%',
            background: rightBgColor,
          }}
        />

        {/* Formas abstractas decorativas (simuladas con círculos) */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-50px',
            width: '400px',
            height: '400px',
            background: rightBgColor,
            borderRadius: '50%',
            opacity: 0.6,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-80px',
            right: '100px',
            width: '300px',
            height: '300px',
            background: '#E8F5E9',
            borderRadius: '50%',
            opacity: 0.4,
          }}
        />

        {/* Contenedor principal con layout similar a la sección Hero */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            padding: '50px 70px',
            position: 'relative',
            zIndex: 10,
          }}
        >
          {/* Columna izquierda: Contenido de texto (como Hero) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              maxWidth: '55%',
              paddingRight: '40px',
            }}
          >
            {/* Saludo (como h4.freelancer) */}
            <div
              style={{
                fontSize: 32,
                fontWeight: 500,
                color: blackColor,
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              HOLA, SOY CRIS
            </div>

            {/* Título principal (como Typewriter h1) */}
            <h1
              style={{
                fontSize: 80,
                fontWeight: 600,
                color: blackColor,
                margin: 0,
                marginBottom: '12px',
                letterSpacing: '-1px',
                lineHeight: 1.2,
              }}
            >
              Líder Técnico|
            </h1>

            {/* Ubicación (como p.description) */}
            <p
              style={{
                fontSize: 24,
                fontWeight: 500,
                color: blackColor,
                margin: 0,
                marginBottom: '40px',
                letterSpacing: '-1px',
              }}
            >
              ubicado en Bogotá, Colombia
            </p>

            {/* Tecnologías */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px',
                marginTop: '20px',
              }}
            >
              {technologies.map((tech) => (
                <div
                  key={tech}
                  style={{
                    backgroundColor: blackColor,
                    color: whiteColor,
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: 16,
                    fontWeight: 500,
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                  }}
                >
                  {tech}
                </div>
              ))}
            </div>
          </div>

          {/* Columna derecha: Foto de perfil circular (como img-wrapper) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              maxWidth: '45%',
              position: 'relative',
            }}
          >
            {/* Contenedor de ondas (simulado) */}
            <div
              style={{
                width: '380px',
                height: '380px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Ondas superiores (simuladas) */}
              <div
                style={{
                  position: 'absolute',
                  top: '-20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '100%',
                  height: '20px',
                  display: 'flex',
                  gap: '8px',
                  justifyContent: 'center',
                }}
              >
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: '4px',
                      height: '20px',
                      background: blackColor,
                      opacity: 0.3,
                    }}
                  />
                ))}
              </div>

              {/* Círculo de fondo amarillo */}
              <div
                style={{
                  width: '360px',
                  height: '360px',
                  borderRadius: '50%',
                  background: rightBgColor,
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid rgba(0, 0, 0, 0.1)',
                }}
              >
                {/* Foto de perfil */}
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Cristian SRC"
                    style={{
                      width: '340px',
                      height: '340px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid rgba(0, 0, 0, 0.2)',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '340px',
                      height: '340px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: whiteColor,
                      fontSize: 48,
                      fontWeight: 700,
                    }}
                  >
                    CS
                  </div>
                )}
              </div>

              {/* Ondas inferiores (simuladas) */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '100%',
                  height: '20px',
                  display: 'flex',
                  gap: '8px',
                  justifyContent: 'center',
                }}
              >
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: '4px',
                      height: '20px',
                      background: blackColor,
                      opacity: 0.3,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}