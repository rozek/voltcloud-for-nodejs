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

### Mandating ###

Because of how VoltCloud works, `voltcloud-for-nodejs` may run in one of three modes, distinguished by "mandates":

* independent of a "mandate" (and even without any), the library always allows to register and confirm new customers, resend confirmation messages and initiate or complete password resets
* while logged-in as a developer, the library also allows to create and manage applications and customers and their associated key-value stores
* while logged-in as a customer, the library also allows to manage that customer's account and key-value store.

"Mandates" are set using one of the functions `actOnBehalfOfDeveloper` or `actOnBehalfOfCustomer`. Before any of these function is called, no "mandate" will be set. Any successful completion of `actOnBehalfOfDeveloper` or `actOnBehalfOfCustomer` will change the currently active mandate to that of the given developer or customer, resp.

Mandates may be changed as often as needed and allow `voltcloud-for-nodejs` to be used both for VoltCloud applications (running with customer mandates) and servers (running with developer mandates)

### Focusing ###

Because `voltcloud-for-nodejs` is most often used for a specific VoltCloud application and/or for a specific csutomer only, it is possible to "focus" on that application or customer using `focusOnApplication`, `focusOnApplicationCalled`, `focusOnCustomer` or `focusOnCustomerWithAddress`, resp. If a new application is created (using `focusOnNewApplication`) or a new customer registered (using `focusOnNewCustomer`), that one is automatically focused. Additionally, running on behalf of a customer also automatically focuses that customer.

Normally, all application- or customer-specific functions require such a focus. Only `resendConfirmationEMailToCustomer`, `confirmCustomerUsing`, `startPasswordResetForCustomer`, `resetCustomerPasswordUsing` and `CustomerRecord` may be run without a customer focus by providing (a token or) the email address of the curernt target customer.

### Error Handling ###

In contrast to Java, it's not very common in JavaScript to throw specific subclasses of `Error` depending on the type of error that occurred. `voltcloud-for-nodejs` therefore throws "named errors", i.e., instances of `Error` which contain a `name` and a `message` property. The `name` property distinguishes the various error "types" and may be easily used in a `switch` statement to perform some type-specific error handling.

## API Reference ##

### exported Constants ###

### exported Types ###

### exported Classification and Validation Functions ###

### exported Functions independent of any Mandate ###

### exported Functions for Developer Mandates ###

### exported Functions for Customer Mandates ###




## Prerequisites ##

`voltcloud-for-nodejs` has been built for and, thus, requires [Node.js](https://nodejs.org/). Since you are visiting this page, chances are good that you already have Node.js installed on your machine - if not, please follow the instructions found on nodejs.org to install it (the LTS version is sufficient if you prefer that)

## Installation ##

Simply install the package into your build environment using [NPM](https://docs.npmjs.com/) with the command

```
npm install voltcloud-for-nodejs
```

### Access ###

Within your Node.js script, you may then import any functions you need - the following example will import all of them:

```
import {
  actOnBehalfOfDeveloper, actOnBehalfOfCustomer,
  ApplicationRecords, CustomerRecords,
  focusOnApplication, focusOnApplicationCalled, focusOnNewApplication,
  ApplicationRecord, changeApplicationNameTo, updateApplicationRecordBy,
    uploadToApplication, deleteApplication,
  ApplicationStorage, ApplicationStorageEntry, setApplicationStorageEntryTo,
    deleteApplicationStorageEntry, clearApplicationStorage,
  focusOnCustomer, focusOnCustomerWithAddress, focusOnNewCustomer,
  resendConfirmationEMailToCustomer, confirmCustomerUsing,
  startPasswordResetForCustomer, resetCustomerPasswordUsing,
  CustomerRecord, changeCustomerEMailAddressTo, changeCustomerPasswordTo,
    updateCustomerRecordBy, deleteCustomer,
  CustomerStorage, CustomerStorageEntry, setCustomerStorageEntryTo,
    deleteCustomerStorageEntry, clearCustomerStorage
} from 'voltcloud-for-servers'
```

Just copy that statement into your source code and remove all unwanted functions.






## Build Instructions ##

You may easily build this package yourself.

Just install [NPM](https://docs.npmjs.com/) according to the instructions for your platform and follow these steps:

1. either clone this repository using [git](https://git-scm.com/) or [download a ZIP archive](https://github.com/rozek/voltcloud-for-nodejs/archive/refs/heads/main.zip) with its contents to your disk and unpack it there 
2. open a shell and navigate to the root directory of this repository
3. run `npm install` in order to install the complete build environment
4. execute `npm run build` to create a new build

If you made some changes to the source code, you may also try

```
npm run agadoo
```

in order to check if the result is still tree-shakable.

You may also look into the author's [build-configuration-study](https://github.com/rozek/build-configuration-study) for a general description of his build environment.

## License ##

[MIT License](LICENSE.md)

