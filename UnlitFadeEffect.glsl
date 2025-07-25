import {
    "tjs-common"
}

properties {
    @Name("Albedo Map") 
    @Define("USE_MAP")
    sampler2D tDiffuseMap, 

    @Name("Albedo Color") 
    @UiColor()
    vec3 cDiffuseColor = vec3(1.0, 1.0, 1.0)
}

vertex {
    varying vec3 vViewPosition;
    varying vec3 vNormal;
    varying vec2 vUV;

    void main(void) {
        vec4 viewpos = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = viewpos.xyz;
        vNormal = normalMatrix * normal;
        vUV = uv; 
        gl_Position = projectionMatrix * viewpos;
    }
}

fragment {
    varying vec3 vViewPosition;
    varying vec3 vNormal;
    varying vec2 vUV;

 
    uniform vec3 cDiffuseColor;
    uniform sampler2D tDiffuseMap;


    void main(void) {
     
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(-vViewPosition);

        vec2 adjustedUV = vUV; 
  
        adjustedUV.x = fract(adjustedUV.x);

        adjustedUV.x = 0.5 - abs(adjustedUV.x - 0.5);

        vec3 finalColor = cDiffuseColor;

        #ifdef USE_MAP
      
            vec4 texel = texture2D(tDiffuseMap, adjustedUV); 

            if (texel.a < 0.5) {
                discard;
            }

            finalColor.rgb *= texel.rgb;
        #endif

        gl_FragColor = vec4(finalColor, 1.0); 

        #include <encodings_fragment>
    }
}