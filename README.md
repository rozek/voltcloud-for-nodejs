# voltcloud-for-nodejs #

a simple VoltCloud client library for Node.js

[VoltCloud.io](https://voltcloud.io) is a simple (and reasonably priced) deployment server for web applications with integrated user management and key-value stores for both the application itself and any of its users.

`voltcloud-for-nodejs` is a simple client library for applications (or servers) based on Node.js which need access to VoltCloud and its functions.

See below for a "smoke test" which may also serve as an example for how to use this library.

> Please note: the author is not affiliated with the NSB Corporation in any way. If you want to blame any of the author's VoltCloud-related tools and libraries for some misbehaviour, it's not the fault of George Henne and his team - it is the author's mistake!

**NPM users**: please consider the [Github README](https://github.com/rozek/voltcloud-for-nodejs/blob/main/README.md) for the latest description of this package (as updating the docs would otherwise always require a new NPM package version)

> Just a small note: if you like this module and plan to use it, consider "starring" this repository (you will find the "Star" button on the top right of this page), so that I know which of my repositories to take most care of.

## Overview ##

As a developer, one may sign-up for VoltCloud to create (web-based) applications and give them a name. Then, the actual application may be uploaded to VoltCloud and will from now on be served from a VoltCloud URL which includes the given name.

If desired, VoltCloud applications may support their own "users" (in this document, these users are called "customers" in order to explicitly distinguish them from application "developers").

Users may register themselves for a VoltCloud application by providing their EMail address and a password (which they will need later to log into the application). Upon registration, a "confirmation mail" will be sent to the given address that includes a special link to the application which, when clicked, will allow the application to confirm the given user. Should the confirmation message get lost, it may be resent upon request.

Should a customer forget his/ger password, there is also the possibility to initiate a "password reset" process. If triggered, a "password reset email" with a special link to the application will be sent to the customer which, when clicked, should allow the customer to change his/her password. A password reset may be triggered as often as needed.

It is important to understand, that an application and a customer who registered for it form a unit. As a consequence, the EMail address may be used for multiple applications - and all customers with that address will be completely independent from each other. VoltCloud does *not* offer any possibility to extend a given registration to other applications.

Once confirmed, a customer may set a first and/or a last name, change his/her password and even configure a new EMail address.

A developer may request a list of all customers which registered for a given application and sees their EMail addresses, their names and whether they have already been confirmed or not - but VoltCloud does not show him/her any customer's password (not even a hash value)

VoltCloud also manages individual key-value stores for an application and each of its customers. Both keys and values have to be strings (keys may be up to 255 characters long, values up to 1048574 characters). As is common practice, new entries may be created at will, existing entries read or deleted and a list of all entries requested from VoltCloud.

Developers may inspect and change both an application's key-value store and the stores of all related customers, while customers themselves may inspect and change their own store, but only inspect (and *not* change) the store of the application they registered for.

#### Mandating ####

Because of how VoltCloud works, `voltcloud-for-nodejs` may run in one of three modes, distinguished by "mandates":

* independent of a "mandate" (and even without any), the library always allows to register and confirm new customers, resend confirmation messages and initiate or complete password resets
* while logged-in as a developer, the library also allows to create and manage applications and customers and their associated key-value stores
* while logged-in as a customer, the library also allows to manage that customer's account and key-value store.

"Mandates" are set using one of the functions `actOnBehalfOfDeveloper` or `actOnBehalfOfCustomer`. Before any of these function is called, no "mandate" will be set. Any successful completion of `actOnBehalfOfDeveloper` or `actOnBehalfOfCustomer` will change the currently active mandate to that of the given developer or customer, resp.
