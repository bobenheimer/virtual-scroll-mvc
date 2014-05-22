module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    less: {
      development: {
        src: ["common/less/app.less"],
        dest: "common/css/app.css"
      }
    },
    watch: {
      options: {
        atBegin: true
      },
      less: {
        files: ["common/less/**/*"],
        tasks: ["less"]
      }
    }

  });

  grunt.loadNpmTasks("grunt-contrib-less");
  grunt.loadNpmTasks("grunt-contrib-watch");

}

