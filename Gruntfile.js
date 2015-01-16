module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    react: {
      development: {
        files: {
          "app/react/js/app.js": [ "app/react/jsx/*.jsx" ]
        }
      }
    },

    less: {
      development: {
        src: ["app/common/less/app.less"],
        dest: "app/common/css/app.css"
      }
    },

    watch: {
      options: {
        atBegin: true
      },
      less: {
        files: ["app/common/less/**/*", "app/react/jsx/**/*"],
        tasks: ["less", "react"]
      }
    }

  });

  grunt.loadNpmTasks('grunt-react');
  grunt.loadNpmTasks("grunt-contrib-less");
  grunt.loadNpmTasks("grunt-contrib-watch");

};

