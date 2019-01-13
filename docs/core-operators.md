# Operators - Core module

## $car
* `($car list)`
  * `list`: A list that length is 1 or greater.
    * `'(first second ... last)`

#### Returns
* The first item of the parameter `list`.
  * `first`

#### Description
* Get the first item of the parameter `list`.  

#### Errors
* If length of `list` is 0.
* If type of `list` is not a list.

----

## $cdr
* `($cdr list)`
  * `list`: A list that length is 1 or greater.
    * `'(first second ... last)`

#### Returns
* The second and subsequent items in the parameter `list`.
    * `'(second ... last)`

#### Description
* Get the second and subsequent items in the parameter `list`.
* Returned list is a partial copy of the parameter `list`.  
  The list pointed from parameter `list` is unchanged.

#### Errors
* If length of `list` is 0.
* If type of `list` is not a list.

