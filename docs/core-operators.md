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


----

## $cons

#### Returns

#### Description

#### Errors


----

## $first

#### Returns

#### Description

#### Errors


----

## $second

#### Returns

#### Description

#### Errors


----

## $last

#### Returns

#### Description

#### Errors


----

## $rest

#### Returns

#### Description

#### Errors


----

## $first-and-second

#### Returns

#### Description

#### Errors


----

## $atom

#### Returns

#### Description

#### Errors


----

## $eq

#### Returns

#### Description

#### Errors


----

## $not-eq

#### Returns

#### Description

#### Errors


----

## $list

#### Returns

#### Description

#### Errors


----

## $scope

#### Returns

#### Description

#### Errors


----

## $global

#### Returns

#### Description

#### Errors


----

## $capture

#### Returns

#### Description

#### Errors


----

## $lambda

#### Returns

#### Description

#### Errors


----

## $$lambda

#### Returns

#### Description

#### Errors


----

## $defun

#### Returns

#### Description

#### Errors


----

## $$defun

#### Returns

#### Description

#### Errors


----

## $refun

#### Returns

#### Description

#### Errors


----

## $defmacro

#### Returns

#### Description

#### Errors


----

## $apply

#### Returns

#### Description

#### Errors


----

## $call

#### Returns

#### Description

#### Errors


----

## $try

#### Returns

#### Description

#### Errors


----

## $raise

#### Returns

#### Description

#### Errors


----

## $if

#### Returns

#### Description

#### Errors


----

## $if-null

#### Returns

#### Description

#### Errors


----

## $cond

#### Returns

#### Description

#### Errors


----

## $while

#### Returns

#### Description

#### Errors


----

## $do-while

#### Returns

#### Description

#### Errors


----

## $until

#### Returns

#### Description

#### Errors


----

## $do-until

#### Returns

#### Description

#### Errors


----

## $repeat

#### Returns

#### Description

#### Errors


----

## $for

#### Returns

#### Description

#### Errors


----

## $pipe

#### Returns

#### Description

#### Errors


----

## $get

#### Returns

#### Description

#### Errors


----

## $let

#### Returns

#### Description

#### Errors


----

## $set

#### Returns

#### Description

#### Errors


----

## $boolean

#### Returns

#### Description

#### Errors


----

## $not

#### Returns

#### Description

#### Errors


----

## $and

#### Returns

#### Description

#### Errors


----

## $or

#### Returns

#### Description

#### Errors


----

## ==

#### Returns

#### Description

#### Errors


----

## &lt;

#### Returns

#### Description

#### Errors


----

## &lt;=

#### Returns

#### Description

#### Errors


----

## &gt;

#### Returns

#### Description

#### Errors


----

## &gt;=

#### Returns

#### Description

#### Errors


----

## $symbol

#### Returns

#### Description

#### Errors


----

## $gensym

#### Returns

#### Description

#### Errors


----

## $is-symbol

#### Returns

#### Description

#### Errors


----

## $is-list

#### Returns

#### Description

#### Errors


----

## $is-string

#### Returns

#### Description

#### Errors


----

## $is-number

#### Returns

#### Description

#### Errors


----

## $is-NaN

#### Returns

#### Description

#### Errors


----

## $is-finate

#### Returns

#### Description

#### Errors


----

## $is-integer

#### Returns

#### Description

#### Errors


----

## $to-string

#### Returns

#### Description

#### Errors


----

## $to-number

#### Returns

#### Description

#### Errors


----

## #

#### Returns

#### Description

#### Errors


----

## $object-assign

#### Returns

#### Description

#### Errors


----

## $json-stringify

#### Returns

#### Description

#### Errors


----

## $json-parse

#### Returns

#### Description

#### Errors


----

## $now

#### Returns

#### Description

#### Errors


----

## $datetime-from-iso

#### Returns

#### Description

#### Errors


----

## $datetime

#### Returns

#### Description

#### Errors


----

## $datetime-lc

#### Returns

#### Description

#### Errors


----

## $datetime-to-iso-string

#### Returns

#### Description

#### Errors


----

## $datetime-to-components

#### Returns

#### Description

#### Errors


----

## $datetime-to-components-lc

#### Returns

#### Description

#### Errors


----

## $match

#### Returns

#### Description

#### Errors


----

## $console-log

#### Returns

#### Description

#### Errors


----

## $console-error

#### Returns

#### Description

#### Errors


----

## $console-trace

#### Returns

#### Description

#### Errors


----

## $console-time

#### Returns

#### Description

#### Errors


----

## $console-time-end

#### Returns

#### Description

#### Errors


----

## $console-time-log

#### Returns

#### Description

#### Errors

