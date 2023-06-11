export const vertexShader = `
  varying vec2 v_uv;

  void main() {
    vec3 pos = position;
    gl_Position = vec4( pos, 1.0 );
    v_uv = uv;
  }

  `