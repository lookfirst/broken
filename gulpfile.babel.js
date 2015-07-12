import gulp from 'gulp';
import gulpHelpers from 'gulp-helpers';
import {Builder} from 'jspm';

let taskMaker = gulpHelpers.taskMaker(gulp);
let situation = gulpHelpers.situation();
let _ = gulpHelpers.framework('_');
let runSequence = gulpHelpers.framework('run-sequence');


let path = {
	source: 'src/main/js/**/*.js',
	output: 'target/js',
	war: 'target/hub-1.0-SNAPSHOT',
	watch: 'src/main/js/**',
	templates: 'src/main/js/**/*.tpl.html',
	less_css: 'src/main/css/**/*.less',
	config: 'src/main/config/',
	node_modules: 'node_modules',
	karmaConfig: __dirname + '/karma.conf.js',
	files: [
		'target/js/**/*.css',
		'target/js/**/*.js',
		'target/css/**/*.css',
		'target/hub-*/config.js',
		'target/hub-*/img/**/*'
	]
};


let bundler = (app) => {
	let builder = new Builder();
	return builder.buildSFX(`js/${app}/app`, `${path.war}/js/${app}/${app}-bundle.js`, {minify: false, sourceMaps: true});
};

taskMaker.defineTask('clean', {taskName: 'clean', src: path.output});
taskMaker.defineTask('babel', {taskName: 'babel', src: path.source, dest: path.output, ngAnnotate: true, compilerOptions: {modules: 'system'}, watchTask: true, notify: true});

gulp.task('compile', (callback) => {
	return runSequence(['babel'], callback);
});

gulp.task('recompile', (callback) => {
	return runSequence('clean', 'compile', callback);
});

gulp.task('deploy', (callback) => {
	return runSequence('recompile', 'bundle', callback);
});

gulp.task('bundle', () => {
	return bundler('sell');
});

gulp.task('run', (callback) => {
	return runSequence('deploy', callback);
});

gulp.task('default', ['run']);
