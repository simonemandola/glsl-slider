export const fragmentShader = `
    uniform float u_time;
    uniform float u_progress;
    uniform int u_transitionType;
    uniform sampler2D u_currentTexture;
    uniform sampler2D u_nextTexture;
    uniform sampler2D u_transitionTexture;
    uniform vec2 u_resolution;
    uniform vec2 u_image_resolution;

    varying vec2 v_uv;

    mat2 rotate(float angle) {
      return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    }

    /*------------------------------
    Background Cover UV from https://tympanus.net/codrops/2023/04/27/building-a-webgl-carousel-with-react-three-fiber-and-gsap/
    --------------------------------
    u = basic UV
    s = screensize
    i = image size
    ------------------------------*/
    vec2 CoverUV(vec2 u, vec2 s, vec2 i) {
      float rs = s.x / s.y; // Aspect screen size
      float ri = i.x / i.y; // Aspect image size
      vec2 st = rs < ri ? vec2(i.x * s.y / i.y, s.y) : vec2(s.x, i.y * s.x / i.x); // New st
      vec2 o = (rs < ri ? vec2((st.x - s.x) / 2.0, 0.0) : vec2(0.0, (st.y - s.y) / 2.0)) / st; // Offset to center
      return u * s / st + o;
    }

    void main() {
      vec2 uv = CoverUV(v_uv, u_resolution, u_image_resolution);

      // Ripple
      float distToCenter = length(uv.y - 0.5);
      float d = sin(distToCenter * 50. - u_time);
      vec2 dir = normalize(uv - 0.5);
      vec2 rippleUv = uv + d * dir * 0.2;

      float angle = 0.1;

      vec4 currentTexture = texture2D(u_currentTexture, uv);
      vec4 nextTexture = texture2D(u_nextTexture, uv);
      vec4 transitionTexture = texture2D(u_transitionTexture, uv);

      vec3 color = currentTexture.rgb;

      if (u_transitionType == 0) {

        // Fade
        color = mix(currentTexture.rgb, nextTexture.rgb, u_progress);

      } else if (u_transitionType == 1) {

        // Circle center
        vec2 uv = ((v_uv - 0.5) * u_resolution) / u_resolution.x;
        vec2 center = vec2(0.0);
        float c = length(uv - center);
        float radio = u_progress * 0.8;
        float circle = smoothstep(radio - 0.01, radio + 0.01, c);
        color = mix(nextTexture.rgb, currentTexture.rgb, circle);

      } else if (u_transitionType == 2) {

        // Circle top right
        vec2 uv = ((v_uv - 0.5) * u_resolution) / u_resolution.x;
        vec2 center = vec2(0.5);
        float c = length(uv - center);
        float radio = u_progress * 1.5;
        float circle = smoothstep(radio - 0.01, radio + 0.01, c);
        color = mix(nextTexture.rgb, currentTexture.rgb, circle);

      } else if (u_transitionType == 3) {

        // Circle top left
        vec2 uv = ((v_uv - 0.5) * u_resolution) / u_resolution.x;
        vec2 center = vec2(-0.5, 0.5);
        float c = length(uv - center);
        float radio = u_progress * 1.5;
        float circle = smoothstep(radio - 0.01, radio + 0.01, c);
        color = mix(nextTexture.rgb, currentTexture.rgb, circle);

      } else if (u_transitionType == 4) {

        // Circle center left
        vec2 uv = ((v_uv - 0.5) * u_resolution) / u_resolution.x;
        vec2 center = vec2(-0.5, 0.0);
        float c = length(uv - center);
        float radio = u_progress * 1.5;
        float circle = smoothstep(radio - 0.01, radio + 0.01, c);
        color = mix(nextTexture.rgb, currentTexture.rgb, circle);

      } else if (u_transitionType == 5) {

        // Circle center right
        vec2 uv = ((v_uv - 0.5) * u_resolution) / u_resolution.x;
        vec2 center = vec2(0.5, 0.0);
        float c = length(uv - center);
        float radio = u_progress * 1.5;
        float circle = smoothstep(radio - 0.01, radio + 0.01, c);
        color = mix(nextTexture.rgb, currentTexture.rgb, circle);

      } else if (u_transitionType == 6) {

        // Circle bottom left
        vec2 uv = (((v_uv - 0.5) * u_resolution) / u_resolution.x);
        vec2 center = vec2(-0.5);
        float c = length(uv - center);
        float radio = u_progress * 1.5;
        float circle = smoothstep(radio - 0.01, radio + 0.01, c);
        color = mix(nextTexture.rgb, currentTexture.rgb, circle);

      } else if (u_transitionType == 7) {

        // Circle bottom right
        vec2 uv = (((v_uv - 0.5) * u_resolution) / u_resolution.x);
        vec2 center = vec2(0.5, -0.5);
        float c = length(uv - center);
        float radio = u_progress * 1.5;
        float circle = smoothstep(radio - 0.01, radio + 0.01, c);
        color = mix(nextTexture.rgb, currentTexture.rgb, circle);

      } else if (u_transitionType == 8) {

        // Line left to right
        vec2 uv = (((v_uv - 0.5) * u_resolution) / u_resolution.x);
        float start = u_progress - 0.5;
        float st = step(start, uv.x);
        color = mix(nextTexture.rgb, currentTexture.rgb, st);

      } else if (u_transitionType == 9) {

        // Line right to left
        vec2 uv = (((v_uv - 0.5) * u_resolution) / u_resolution.x);
        float start = u_progress - 0.5;
        float st = step(start, -uv.x);
        color = mix(nextTexture.rgb, currentTexture.rgb, st);

      } else if (u_transitionType == 10) {

        // Line top to bottom
        vec2 uv = (((v_uv - 0.5) * u_resolution) / u_resolution.x);
        float start = u_progress - 0.5;
        float st = step(start, -uv.y);
        color = mix(nextTexture.rgb, currentTexture.rgb, st);

      } else if (u_transitionType == 11) {

        // Line bottom to top
        vec2 uv = (((v_uv - 0.5) * u_resolution) / u_resolution.x);
        float start = u_progress - 0.5;
        float st = step(start, uv.y);
        color = mix(nextTexture.rgb, currentTexture.rgb, st);

      } else if (u_transitionType == 12) {

        // Lines horizontal left to right
        float r = u_resolution.x >= u_resolution.y ? u_resolution.x : u_resolution.y;
        vec2 uv = (((v_uv - 0.5) * u_resolution) / r);
        float start = u_progress;
        float st = step(start, fract(uv.x * 8.));
        color = mix(nextTexture.rgb, currentTexture.rgb, st);

      } else if (u_transitionType == 13) {

        // Lines horizontal right to left
        float r = u_resolution.x >= u_resolution.y ? u_resolution.x : u_resolution.y;
        vec2 uv = (((v_uv - 0.5) * u_resolution) / r);
        float start = u_progress;
        float st = step(start, fract(-uv.x * 8.));
        color = mix(nextTexture.rgb, currentTexture.rgb, st);

      } else if (u_transitionType == 14) {

        // Lines horizontal top to bottom
        float r = u_resolution.x >= u_resolution.y ? u_resolution.x : u_resolution.y;
        vec2 uv = (((v_uv - 0.5) * u_resolution) / r);
        float start = u_progress;
        float st = step(start, fract(-uv.y * 8.));
        color = mix(nextTexture.rgb, currentTexture.rgb, st);

      } else if (u_transitionType == 15) {

        // Lines horizontal bottom to top
        float r = u_resolution.x >= u_resolution.y ? u_resolution.x : u_resolution.y;
        vec2 uv = (((v_uv - 0.5) * u_resolution) / r);
        float start = u_progress;
        float st = step(start, fract(uv.y * 8.));
        color = mix(nextTexture.rgb, currentTexture.rgb, st);

      } else if (u_transitionType == 16) {

        // Multiples Lines horizontal left to right
        float r = u_resolution.x >= u_resolution.y ? u_resolution.x : u_resolution.y;
        vec2 uv = (((v_uv - 0.5) * u_resolution) / r);
        float start = u_progress;
        float st = step(start, fract(uv.x * 80.));
        color = mix(nextTexture.rgb, currentTexture.rgb, st);

      } else if (u_transitionType == 17) {

        // Multiples Lines horizontal right to left
        float r = u_resolution.x >= u_resolution.y ? u_resolution.x : u_resolution.y;
        vec2 uv = (((v_uv - 0.5) * u_resolution) / r);
        float start = u_progress;
        float st = step(start, fract(-uv.x * 80.));
        color = mix(nextTexture.rgb, currentTexture.rgb, st);

      } else if (u_transitionType == 18) {

        // Multiples Lines horizontal top to bottom
        float r = u_resolution.x >= u_resolution.y ? u_resolution.x : u_resolution.y;
        vec2 uv = (((v_uv - 0.5) * u_resolution) / r);
        float start = u_progress;
        float st = step(start, fract(-uv.y * 80.));
        color = mix(nextTexture.rgb, currentTexture.rgb, st);

      } else if (u_transitionType == 19) {

        // Multiples Lines horizontal bottom to top
        float r = u_resolution.x >= u_resolution.y ? u_resolution.x : u_resolution.y;
        vec2 uv = (((v_uv - 0.5) * u_resolution) / r);
        float start = u_progress;
        float st = step(start, fract(uv.y * 80.));
        color = mix(nextTexture.rgb, currentTexture.rgb, st);

      } else if (u_transitionType == 20) {

        // Multiples Lines vertical center to out
        float r = u_resolution.x >= u_resolution.y ? u_resolution.x : u_resolution.y;
        vec2 uv = (((v_uv - 0.5) * u_resolution) / r);
        float start = u_progress;
        float st = step(start, fract(abs(uv.x) * 8.));
        color = mix(nextTexture.rgb, currentTexture.rgb, st);

      } else if (u_transitionType == 21) {

        // Multiples Lines horizontal center to out
        float r = u_resolution.x >= u_resolution.y ? u_resolution.x : u_resolution.y;
        vec2 uv = (((v_uv - 0.5) * u_resolution) / r);
        float start = u_progress;
        float st = step(start, fract(abs(uv.y) * 8.));
        color = mix(nextTexture.rgb, currentTexture.rgb, st);

      } else if (u_transitionType == 22) {

        // Cross center to out
        float r = u_resolution.x >= u_resolution.y ? u_resolution.x : u_resolution.y;
        vec2 uv = (((v_uv - 0.5) * u_resolution) / r);
        float start = u_progress;
        float st = smoothstep(start - 0.1, start + 0.1, fract(abs(uv.y * uv.x) * 8.));
        color = mix(nextTexture.rgb, currentTexture.rgb, st);

      } else if (u_transitionType == 23) {

        // Cross out to center
        float r = u_resolution.x >= u_resolution.y ? u_resolution.x : u_resolution.y;
        vec2 uv = (((v_uv - 0.5) * u_resolution) / r);
        float start = u_progress;
        float st = smoothstep(start - 0.1, start + 0.1, fract(-abs(uv.y * uv.x) * 8.));
        color = mix(nextTexture.rgb, currentTexture.rgb, st);

      } else if (u_transitionType == 24) {

        // Textures R channel
        float r = u_resolution.x >= u_resolution.y ? u_resolution.x : u_resolution.y;
        vec2 uv = (((v_uv - 0.5) * u_resolution) / r);
        float start = u_progress - 0.5;
        float st = smoothstep(start - 0.1, start + 0.1, currentTexture.r * nextTexture.r);
        color = mix(nextTexture.rgb, currentTexture.rgb, st);

      } else if (u_transitionType == 25) {

        // Sand
        float r = u_resolution.x >= u_resolution.y ? u_resolution.x : u_resolution.y;
        vec2 uv = (((v_uv - 0.5) * u_resolution) / r);
        float start = u_progress;
        float st = smoothstep(start - 0.1, start + 0.1, (currentTexture.r * nextTexture.r) + rippleUv.x );
        color = mix(nextTexture.rgb, currentTexture.rgb, st);

      } else if (u_transitionType == 26) {

        // Transition texture
        float r = u_resolution.x >= u_resolution.y ? u_resolution.x : u_resolution.y;
        vec2 uv = (((v_uv - 0.5) * u_resolution) / r);
        float start = u_progress;
        float st = smoothstep(start - 0.1, start + 0.1, transitionTexture.r );
        color = mix(nextTexture.rgb, currentTexture.rgb, st);

      } else if (u_transitionType == 27) {

        // Transition texture center to out
        float r = u_resolution.x >= u_resolution.y ? u_resolution.x : u_resolution.y;
        vec2 uv = (((v_uv - 0.5) * u_resolution) / r);
        float start = u_progress - 0.5;
        float st = smoothstep(start - 0.1, start + 0.1, fract(abs(uv.x) * 2.) * transitionTexture.r);
        color = mix(nextTexture.rgb, currentTexture.rgb, st);

      } else if (u_transitionType == 28) {

        // Pixels
        float r = u_resolution.x >= u_resolution.y ? u_resolution.x : u_resolution.y;
        vec2 uv = ((v_uv * u_resolution) / r);
        vec2 pixels = vec2(56.0);
        vec2 pixelUv = floor(uv * pixels) / pixels;
        vec4 nextTexturePixel = texture2D(u_nextTexture, pixelUv);
        float start = u_progress - 0.5;
        float st = smoothstep(start - 0.1, start + 0.1, nextTexturePixel.r - nextTexturePixel.g);
        color = mix(nextTexturePixel.rgb, currentTexture.rgb, st);

      } else if (u_transitionType == 29) {

        // Big pixels
        float r = u_resolution.x >= u_resolution.y ? u_resolution.x : u_resolution.y;
        vec2 uv = ((v_uv * u_resolution) / r);
        vec2 pixels = vec2(8.0);
        vec2 pixelUv = floor(uv * pixels) / pixels;
        vec4 nextTexturePixel = texture2D(u_nextTexture, pixelUv);
        float start = u_progress - 0.8;
        float st = smoothstep(start - 0.1, start + 0.1, nextTexturePixel.r - nextTexturePixel.g);
        color = mix(nextTexturePixel.rgb, currentTexture.rgb, st);

      } else {

        color = currentTexture.rgb;

      }

      gl_FragColor = vec4(color, 1.0);
    }
  `