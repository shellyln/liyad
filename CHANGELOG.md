# Changelog


## v0.6.0

* Update dependencies.
* Update CI configurations.
* Migrate to webpack 5.


---


## v0.5.0

* Add fall back processing to get `globalThis`, `Object`, and `Function`. (to check for unsafe keywords)
* Fix lint npm scripts.
* Update dependencies.


---


## v0.4.2

* Update dependencies.
* Update CI configurations.
* Update lint configurations.


## v0.4.1

* Update dependencies.


## v0.4.0

* Add package.json to module sub directory; for ES Modules.
    * See also: https://nodejs.org/api/esm.html#esm_package_json_type_field


---


## v0.3.2

* Update build scripts and CI configurations.


## v0.3.1

* Fix an unexpected syntax error when a line comment exists at the end of the file.


## v0.3.0

* Separate file to benefit from tree shaking.
* Add operators.
    * `$typeof`, `$is-null`, `$is-nil`, `$is-undefined`
