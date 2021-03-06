#!/usr/bin/env node
//----------------------------------------------------------------------------//
//                   voltcloud-for-nodejs SmokeTest for CLI                   //
//----------------------------------------------------------------------------//

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
  } from 'voltcloud-for-nodejs'

  import path from 'path'
  import  fs  from 'fs'

  import { expect } from 'chai'

/**** some constants ****/

  const ApplicationNamePrefix = 'vfn-smoke-test-'

/**** some frequently used working variables ****/

  let ApplicationName, ApplicationInfo, ApplicationStore, StoreValue
  let CustomerId, CustomerInfo, CustomerStore

  console.clear()

/**** look for some environment variables ****/

  const DeveloperAddress = process.env.developer_email_address
  if (DeveloperAddress == null) {
    console.error(
      'please, set environment variable "developer_email_address" to the ' +
      'email address of a VoltCloud application developer'
    )
    process.exit(1)
  }

  const DeveloperPassword = process.env.developer_password
  if (DeveloperPassword == null) {
    console.error(
      'please, set environment variable "developer_password" to the ' +
      'password of a VoltCloud application developer'
    )
    process.exit(2)
  }

  let CustomerAddress = process.env.customer_email_address
  if (CustomerAddress == null) {
    console.error(
      'please, set environment variable "customer_email_address" to the ' +
      'email address of a potential VoltCloud user (you should have access ' +
      'to that mail box)'
    )
    process.exit(3)
  }

  let CustomerPassword = process.env.customer_password
  if (CustomerPassword == null) {
    console.error(
      'please, set environment variable "customer_password" to the ' +
      'password of a potential VoltCloud user'
    )
    process.exit(4)
  }

  const CustomerConfirmationToken = process.env.customer_confirmation_token
  const CustomerResetToken        = process.env.customer_password_reset_token

  const emptyApplicationsShouldBeDeleted = (
    process.env.delete_empty_applications != null
  )

/**** let's start ****/

  console.log('acting on behalf of developer "' + DeveloperAddress + '"')

  await actOnBehalfOfDeveloper(DeveloperAddress,DeveloperPassword)

/**** scan list of existing applications ****/

  let ApplicationRecordList = await ApplicationRecords()
  expect(ApplicationRecordList).to.be.an('array')

  ApplicationRecordList.forEach(async (ApplicationRecord) => {
    if (ApplicationRecord.subdomain.startsWith(ApplicationNamePrefix)) {
      ApplicationName = ApplicationRecord.subdomain
      return
    }

    if (emptyApplicationsShouldBeDeleted && (ApplicationRecord.last_upload == null)) {
      console.log('- deleting empty application "' + ApplicationRecord.subdomain + '"')
      await deleteApplication(ApplicationRecord.id)
      return
    }
  })

/**** create new or focus on existing application ****/

  if (ApplicationName == null) {
    ApplicationName = ApplicationNamePrefix + Math.round(Math.random()*999999999999)

    console.log('- creating new smoke test application "' + ApplicationName + '"')

    await focusOnNewApplication()
    await changeApplicationNameTo(ApplicationName)

    ApplicationInfo = await ApplicationRecord()
    expect(ApplicationInfo).to.be.an('object')
    expect(ApplicationInfo.subdomain).to.equal(ApplicationName)

  /**** just to test "focusOnApplication" as well ****/

    await focusOnApplication(ApplicationInfo.id)

    ApplicationInfo = await ApplicationRecord()
    expect(ApplicationInfo).to.be.an('object')
    expect(ApplicationInfo.subdomain).to.equal(ApplicationName)
  } else {
    await focusOnApplicationCalled(ApplicationName)
  }

/**** define (or keep) user confirmation and password reset URLs ****/

  ApplicationInfo = await ApplicationRecord()
  if (
    (ApplicationInfo.confirmation_url == null) ||
    (ApplicationInfo.reset_url        == null)
  ) {
    console.log('- setting user confirmation and password reset URLs')

    await updateApplicationRecordBy({
      confirmation_url:'/#/confirm/{{token}}',
      reset_url:       '/#/reset/{{token}}'
    })

    ApplicationInfo = await ApplicationRecord()
    expect(ApplicationInfo).to.be.an('object')
    expect(ApplicationInfo.confirmation_url).to.equal('/#/confirm/{{token}}')
    expect(ApplicationInfo.reset_url)       .to.equal('/#/reset/{{token}}')
  } else {
    console.log('- user confirmation and password reset URLs are already set')
  }

/**** clear ApplicationStorage ****/

  console.log('- clearing application storage')

  await clearApplicationStorage()

  ApplicationStore = await ApplicationStorage()
  expect(KeysOf(ApplicationStore).length).to.equal(0)

/**** test ApplicationStorage management ****/

  console.log('- testing application storage management (for developer)')

  StoreValue = await ApplicationStorageEntry('missing-key')
  expect(StoreValue).not.to.exist


  await setApplicationStorageEntryTo('key-1','value-1')

  StoreValue = await ApplicationStorageEntry('key-1')
  expect(StoreValue).to.equal('value-1')

  ApplicationStore = await ApplicationStorage()
  expect(KeysOf(ApplicationStore)).to.have.members(['key-1'])


  await setApplicationStorageEntryTo('key-1','value-2')

  StoreValue = await ApplicationStorageEntry('key-1')
  expect(StoreValue).to.equal('value-2')

  ApplicationStore = await ApplicationStorage()
  expect(KeysOf(ApplicationStore)).to.have.members(['key-1'])


  await deleteApplicationStorageEntry('missing-key')


  await deleteApplicationStorageEntry('key-1')

  StoreValue = await ApplicationStorageEntry('key-1')
  expect(StoreValue).not.to.exist

  ApplicationStore = await ApplicationStorage()
  expect(KeysOf(ApplicationStore).length).to.equal(0)

/**** test "clearApplicationStorage" explicitly ****/

  await setApplicationStorageEntryTo('key-1','value-1')

  await clearApplicationStorage()

  ApplicationStore = await ApplicationStorage()
  expect(KeysOf(ApplicationStore).length).to.equal(0)

/**** prepare for later ****/

  await setApplicationStorageEntryTo('key-1','value-1')

/**** if possible: test file upload ****/

  let Archive
  try {
    let FilePath = path.join(process.cwd(),'smoke-test-archive-for-upload.zip')
    Archive = fs.readFileSync(FilePath)
  } catch (Signal) {
    console.log('>>>> warning: could not load file "smoke-test-archive-for-upload.zip"')
    console.log('>>>> file upload will not be tested')
  }

  if (Archive != null) {
    console.log('- uploading file archive (' + Archive.length + ' bytes)')

    await uploadToApplication(Archive)

    ApplicationInfo = await ApplicationRecord()
    expect(ApplicationInfo).to.be.an('object')
    expect(ApplicationInfo.last_upload).to.exist
  }

/**** delete unwanted existing customers ****/

  let CustomerRecordList = await CustomerRecords()
  expect(CustomerRecordList).to.be.an('array')

  CustomerRecordList.forEach(async (CustomerRecord) => {
    if (CustomerRecord.email === CustomerAddress) { // don't touch test customer
      CustomerId = CustomerRecord.id
      await focusOnCustomer(CustomerRecord.id)

      if (
        (CustomerRecord.confirmed == false) ||
        ((await CustomerStorageEntry('password-reset')) === 'pending')
      ) {          // indeed, we should keep this customer as we just created it
        console.log('- keeping customer "' + CustomerAddress + '"')
        return
      }

      CustomerId = null                // will trigger customer recreation later
    }

    console.log('- deleting customer "' + CustomerRecord.email + '"')

    await focusOnCustomer(CustomerRecord.id)
    await deleteCustomer()
  })

/**** if need be: create new customer ****/

  if (CustomerId == null) {
    console.log('- creating new customer "' + CustomerAddress + '"')

    await focusOnNewCustomer(CustomerAddress,CustomerPassword)

    CustomerRecordList = await CustomerRecords()
    CustomerRecordList.forEach((CustomerRecord) => {
      if (CustomerRecord.email === CustomerAddress) {
        CustomerId = CustomerRecord.id
      }
    })
    expect(CustomerId).to.exist

    await showCustomerRecord(CustomerId)

    console.log()
    console.log('a first confirmation email should have been sent to "' + CustomerAddress + '"')
    console.log('just re-run this test without any changes')

    process.exit(0)
  } else {
    console.log('- using existing customer "' + CustomerAddress + '"')

    await focusOnCustomerWithAddress(CustomerAddress) // needed here in order...
    await showCustomerRecord()
  }      // ...to be able to access a customer storage record in this smoke test

/**** if need be: perform customer confirmation ****/

  CustomerInfo = await CustomerRecord(CustomerId)
  expect(CustomerInfo).to.be.an('object')

  if (CustomerInfo.confirmed == false) {
    if ((CustomerConfirmationToken || '') === '') {
      await resendConfirmationEMailToCustomer(CustomerAddress)

      console.log()
      console.log('another confirmation email should have been sent to "' + CustomerAddress + '"')
      console.log('please look for that email and copy the contained token into environment')
      console.log('variable "customer_confirmation_token"')

      process.exit(0)
    } else {
      console.log('- confirming customer "' + CustomerAddress + '"')
      await confirmCustomerUsing(CustomerConfirmationToken)

      CustomerInfo = await CustomerRecord()
      expect(CustomerInfo).to.be.an('object')
      expect(CustomerInfo.id).to.equal(CustomerId)

      await setCustomerStorageEntryTo('password-reset','pending')
    }
  }

/**** if need be: perform customer password reset ****/

  let PasswordResetPending = (           // trick to test password reset as well
    (await CustomerStorageEntry('password-reset')) === 'pending'
  )

  if (PasswordResetPending) {
    if ((CustomerResetToken || '') === '') {
      console.log('- starting password reset for customer "' + CustomerAddress + '"')

      await startPasswordResetForCustomer(CustomerAddress)

      console.log()
      console.log('a password reset email should have been sent to "' + CustomerAddress + '"')
      console.log('please look for that email and copy the contained token into environment')
      console.log('variable "customer_password_reset_token"')

      process.exit(0)
    } else {
      console.log('- performing password reset for customer "' + CustomerAddress + '"')
      await resetCustomerPasswordUsing(CustomerResetToken,CustomerPassword)
    }
  }

/**** focus on the given customer ****/

  console.log('- focusing on customer "' + CustomerAddress + '"')
  await focusOnCustomerWithAddress(CustomerAddress)

  CustomerInfo = await CustomerRecord()
  expect(CustomerInfo).to.be.an('object')
  expect(CustomerInfo.id).to.equal(CustomerId)

/**** test CustomerStorage management ****/

  console.log('- testing customer storage management (for developer)')

  await clearCustomerStorage()                 // removes "password-reset" entry

  StoreValue = await CustomerStorageEntry('missing-key')
  expect(StoreValue).not.to.exist


  await setCustomerStorageEntryTo('key-1','value-1')

  StoreValue = await CustomerStorageEntry('key-1')
  expect(StoreValue).to.equal('value-1')

  CustomerStore = await CustomerStorage()
  expect(KeysOf(CustomerStore)).to.have.members(['key-1'])


  await setCustomerStorageEntryTo('key-1','value-2')

  StoreValue = await CustomerStorageEntry('key-1')
  expect(StoreValue).to.equal('value-2')

  CustomerStore = await CustomerStorage()
  expect(KeysOf(CustomerStore)).to.have.members(['key-1'])


  await deleteCustomerStorageEntry('missing-key')


  await deleteCustomerStorageEntry('key-1')

  StoreValue = await CustomerStorageEntry('key-1')
  expect(StoreValue).not.to.exist

  CustomerStore = await CustomerStorage()
  expect(KeysOf(CustomerStore).length).to.equal(0)

/**** test "clearCustomerStorage" explicitly ****/

  await setCustomerStorageEntryTo('key-1','value-1')

  await clearCustomerStorage()

  CustomerStore = await CustomerStorage()
  expect(KeysOf(CustomerStore).length).to.equal(0)

/**** let's continue with a customer mandate ****/

  console.log('acting on behalf of customer "' + DeveloperAddress + '"')

//await focusOnApplicationCalled(ApplicationName)
  await actOnBehalfOfCustomer(CustomerAddress,CustomerPassword)

/**** change customer email address ****/

  await changeCustomerEMailAddressTo('a.b@c.d')

  CustomerAddress = 'a.b@c.d'
  await actOnBehalfOfCustomer(CustomerAddress,CustomerPassword)

/**** change customer password ****/

  await changeCustomerPasswordTo('an0ther-Passw0rd')

  CustomerPassword = 'an0ther-Passw0rd'
  await actOnBehalfOfCustomer(CustomerAddress,CustomerPassword)

/**** change customer password ****/

  await updateCustomerRecordBy({
    first_name:'John', last_name:'Doe'
  })

/**** test "CustomerRecord" ****/

  await showCustomerRecord()

/**** test ApplicationStorage management ****/

  console.log('- testing application storage management (for customer)')

  StoreValue = await ApplicationStorageEntry('missing-key')
  expect(StoreValue).not.to.exist


  StoreValue = await ApplicationStorageEntry('key-1')
  expect(StoreValue).to.equal('value-1')

  ApplicationStore = await ApplicationStorage()
  expect(KeysOf(ApplicationStore)).to.have.members(['key-1'])

/**** test CustomerStorage management ****/

  console.log('- testing customer storage management (for customer)')

  StoreValue = await CustomerStorageEntry('missing-key')
  expect(StoreValue).not.to.exist


  await setCustomerStorageEntryTo('key-1','value-1')

  StoreValue = await CustomerStorageEntry('key-1')
  expect(StoreValue).to.equal('value-1')

  CustomerStore = await CustomerStorage()
  expect(KeysOf(CustomerStore)).to.have.members(['key-1'])


  await setCustomerStorageEntryTo('key-1','value-2')

  StoreValue = await CustomerStorageEntry('key-1')
  expect(StoreValue).to.equal('value-2')

  CustomerStore = await CustomerStorage()
  expect(KeysOf(CustomerStore)).to.have.members(['key-1'])


  await deleteCustomerStorageEntry('missing-key')


  await deleteCustomerStorageEntry('key-1')

  StoreValue = await CustomerStorageEntry('key-1')
  expect(StoreValue).not.to.exist

  CustomerStore = await CustomerStorage()
  expect(KeysOf(CustomerStore).length).to.equal(0)

/**** test "clearCustomerStorage" explicitly ****/

  await setCustomerStorageEntryTo('key-1','value-1')

  await clearCustomerStorage()

  CustomerStore = await CustomerStorage()
  expect(KeysOf(CustomerStore).length).to.equal(0)

/**** deleteCustomer ****/

  console.log('- deleting customer')
  await deleteCustomer()

/**** let's continue with a developer mandate (again) ****/

  console.log('acting on behalf of developer "' + DeveloperAddress + '" again')

  await actOnBehalfOfDeveloper(DeveloperAddress,DeveloperPassword)
  await focusOnApplicationCalled(ApplicationName)

/**** deleteApplication ****/

  console.log('- deleting smoke test application')
  await deleteApplication()

/**** KeysOf ****/

  function KeysOf (Storage) {
    let KeyList = []
      for (let Key in Storage) {
        if (Storage.hasOwnProperty(Key)) { KeyList.push(Key) }
      }
    return KeyList
  }/**** showCustomerRecord ****/

  async function showCustomerRecord (EMailAddress) {
    CustomerInfo = await CustomerRecord(EMailAddress)

    console.log('- current customer settings:')
    console.log('  - internal id:   ', CustomerInfo.id)
    console.log('  - EMail address: ', CustomerInfo.email)
    console.log('  - confirmed:     ', CustomerInfo.confirmed ? 'yes' : 'no')
    console.log('  - first name:    ', CustomerInfo.first_name || '(unknown)')
    console.log('  - last name:     ', CustomerInfo.last_name  || '(unknown)')
  }

  console.log()
  console.log('Smoke Test finished - "voltcloud-for-nodejs" seems to be working')
