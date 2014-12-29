module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

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
        files: ["app/common/less/**/*"],
        tasks: ["less"]
      }
    }

  });

  grunt.loadNpmTasks("grunt-contrib-less");
  grunt.loadNpmTasks("grunt-contrib-watch");

};

