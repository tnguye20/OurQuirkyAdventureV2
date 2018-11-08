jQuery(document).ready(function(){
      Galleria.loadTheme('/galleria/themes/classic/galleria.classic.min.js');
      // Galleria.loadTheme('/galleria/themes/fullscreen/galleria.fullscreen.min.js');
      Galleria.run('.galleria', {
        autoplay: 7000,
      });
      Galleria.configure({
        lightbox: true
      });
});
