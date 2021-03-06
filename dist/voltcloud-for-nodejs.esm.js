import * as https from 'https';
import { Buffer } from 'buffer';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

//----------------------------------------------------------------------------//
/**** throwError - simplifies construction of named errors ****/
function throwError(Message) {
    var Match = /^([$a-zA-Z][$a-zA-Z0-9]*):\s*(\S.+)\s*$/.exec(Message);
    if (Match == null) {
        throw new Error(Message);
    }
    else {
        var namedError = new Error(Match[2]);
        namedError.name = Match[1];
        throw namedError;
    }
}
/**** ValueIsString ****/
function ValueIsString(Value) {
    return (typeof Value === 'string') || (Value instanceof String);
}
/**** ValueIs[Non]EmptyString ****/
var emptyStringPattern = /^\s*$/;
function ValueIsNonEmptyString(Value) {
    return ((typeof Value === 'string') || (Value instanceof String)) && !emptyStringPattern.test(Value.valueOf());
}
/**** ValueIsStringMatching ****/
function ValueIsStringMatching(Value, Pattern) {
    return ((typeof Value === 'string') || (Value instanceof String)) && Pattern.test(Value.valueOf());
}
/**** ValueIsPlainObject ****/
function ValueIsPlainObject(Value) {
    return ((Value != null) && (typeof Value === 'object') &&
        (Object.getPrototypeOf(Value) === Object.prototype));
}
/**** ValueIsArray ****/
var ValueIsArray = Array.isArray;
/**** ValueIsEMailAddress ****/
var EMailAddressPattern = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
// see https://stackoverflow.com/questions/201323/how-to-validate-an-email-address-using-a-regular-expression
function ValueIsEMailAddress(Value) {
    return ValueIsStringMatching(Value, EMailAddressPattern);
}
//------------------------------------------------------------------------------
//--                      Argument Validation Functions                       --
//------------------------------------------------------------------------------
var rejectNil = false;
var acceptNil = true;
/**** validatedArgument ****/
function validatedArgument(Description, Argument, ValueIsValid, NilIsAcceptable, Expectation) {
    if (Argument == null) {
        if (NilIsAcceptable) {
            return Argument;
        }
        else {
            throwError("MissingArgument: no " + escaped(Description) + " given");
        }
    }
    else {
        if (ValueIsValid(Argument)) {
            switch (true) {
                case Argument instanceof Boolean:
                case Argument instanceof Number:
                case Argument instanceof String:
                    return Argument.valueOf(); // unboxes any primitives
                default:
                    return Argument;
            }
        }
        else {
            throwError("InvalidArgument: the given " + escaped(Description) + " is no valid " + escaped(Expectation));
        }
    }
}
/**** ValidatorForClassifier ****/
function ValidatorForClassifier(Classifier, NilIsAcceptable, Expectation) {
    var Validator = function (Description, Argument) {
        return validatedArgument(Description, Argument, Classifier, NilIsAcceptable, Expectation);
    };
    var ClassifierName = Classifier.name;
    if ((ClassifierName != null) && /^ValueIs/.test(ClassifierName)) {
        var ValidatorName = ClassifierName.replace(// derive name from validator
        /^ValueIs/, NilIsAcceptable ? 'allow' : 'expect');
        return FunctionWithName(Validator, ValidatorName);
    }
    else {
        return Validator; // without any specific name
    }
}
/**** FunctionWithName (works with older JS engines as well) ****/
function FunctionWithName(originalFunction, desiredName) {
    if (originalFunction == null) {
        throwError('MissingArgument: no function given');
    }
    if (typeof originalFunction !== 'function') {
        throwError('InvalidArgument: the given 1st Argument is not a JavaScript function');
    }
    if (desiredName == null) {
        throwError('MissingArgument: no desired name given');
    }
    if ((typeof desiredName !== 'string') && !(desiredName instanceof String)) {
        throwError('InvalidArgument: the given desired name is not a string');
    }
    if (originalFunction.name === desiredName) {
        return originalFunction;
    }
    try {
        Object.defineProperty(originalFunction, 'name', { value: desiredName });
        if (originalFunction.name === desiredName) {
            return originalFunction;
        }
    }
    catch (signal) { /* ok - let's take the hard way */ }
    var renamed = new Function('originalFunction', 'return function ' + desiredName + ' () {' +
        'return originalFunction.apply(this,Array.prototype.slice.apply(arguments))' +
        '}');
    return renamed(originalFunction);
} // also works with older JavaScript engines
/**** expect[ed]Value ****/
function expectValue(Description, Argument) {
    if (Argument == null) {
        throwError("MissingArgument: no " + escaped(Description) + " given");
    }
    else {
        return Argument.valueOf();
    }
}
/**** allow/expect[ed]NonEmptyString ****/
var allowNonEmptyString = /*#__PURE__*/ ValidatorForClassifier(ValueIsNonEmptyString, acceptNil, 'non-empty literal string');
var expectNonEmptyString = /*#__PURE__*/ ValidatorForClassifier(ValueIsNonEmptyString, rejectNil, 'non-empty literal string');
var expectPlainObject = /*#__PURE__*/ ValidatorForClassifier(ValueIsPlainObject, rejectNil, '"plain" JavaScript object');
/**** allow/expect[ed]EMailAddress ****/
var allowEMailAddress = /*#__PURE__*/ ValidatorForClassifier(ValueIsEMailAddress, acceptNil, 'valid EMail address');
var expectEMailAddress = /*#__PURE__*/ ValidatorForClassifier(ValueIsEMailAddress, rejectNil, 'valid EMail address');
/**** escaped - escapes all control characters in a given string ****/
function escaped(Text) {
    var EscapeSequencePattern = /\\x[0-9a-zA-Z]{2}|\\u[0-9a-zA-Z]{4}|\\[0bfnrtv'"\\\/]?/g;
    var CtrlCharCodePattern = /[\x00-\x1f\x7f-\x9f]/g;
    return Text
        .replace(EscapeSequencePattern, function (Match) {
        return (Match === '\\' ? '\\\\' : Match);
    })
        .replace(CtrlCharCodePattern, function (Match) {
        switch (Match) {
            case '\0': return '\\0';
            case '\b': return '\\b';
            case '\f': return '\\f';
            case '\n': return '\\n';
            case '\r': return '\\r';
            case '\t': return '\\t';
            case '\v': return '\\v';
            default: {
                var HexCode = Match.charCodeAt(0).toString(16);
                return '\\x' + '00'.slice(HexCode.length) + HexCode;
            }
        }
    });
}
/**** quotable - makes a given string ready to be put in single/double quotes ****/
function quotable(Text, Quote) {
    if (Quote === void 0) { Quote = '"'; }
    var EscSeqOrSglQuotePattern = /\\x[0-9a-zA-Z]{2}|\\u[0-9a-zA-Z]{4}|\\[0bfnrtv'"\\\/]?|'/g;
    var EscSeqOrDblQuotePattern = /\\x[0-9a-zA-Z]{2}|\\u[0-9a-zA-Z]{4}|\\[0bfnrtv'"\\\/]?|"/g;
    var CtrlCharCodePattern = /[\x00-\x1f\x7f-\x9f]/g;
    return Text
        .replace(Quote === "'" ? EscSeqOrSglQuotePattern : EscSeqOrDblQuotePattern, function (Match) {
        switch (Match) {
            case "'": return "\\'";
            case '"': return '\\"';
            case '\\': return '\\\\';
            default: return Match;
        }
    })
        .replace(CtrlCharCodePattern, function (Match) {
        switch (Match) {
            case '\0': return '\\0';
            case '\b': return '\\b';
            case '\f': return '\\f';
            case '\n': return '\\n';
            case '\r': return '\\r';
            case '\t': return '\\t';
            case '\v': return '\\v';
            default: {
                var HexCode = Match.charCodeAt(0).toString(16);
                return '\\x' + '00'.slice(HexCode.length) + HexCode;
            }
        }
    });
}
/**** quoted ****/
function quoted(Text, Quote) {
    if (Quote === void 0) { Quote = '"'; }
    return Quote + quotable(Text, Quote) + Quote;
}

//----------------------------------------------------------------------------//
/**** VoltCloud-specific types and constants ****/
var ApplicationIdPattern = /^[a-zA-Z0-9]{6,}$/; // taken from a validation error message
var ApplicationNamePattern = /^([a-z0-9]|[a-z0-9][-a-z0-9]*[a-z0-9])$/; // dto.
var maxApplicationNameLength = 63; // see discussion forum
var maxEMailAddressLength = 255; // dto.
var maxNamePartLength = 255; // dto.
var maxStorageKeyLength = 255; // as mentioned in REST API docs
var maxStorageValueLength = 1048574; // see discussion forum
/**** internal constants and variables ****/
var Timeout = 30 * 1000; // request timeout given in ms
var DashboardURL = 'https://dashboard.voltcloud.io';
var DashboardId = 'RpYCMN';
var activeDeveloperId;
var activeDeveloperAddress;
var activeDeveloperPassword; // stored for token refresh
var activeCustomerId;
var activeCustomerAddress;
var activeCustomerPassword; // stored for token refresh
var activeAccessToken;
var currentApplicationId;
var currentApplicationURL;
var currentCustomerId;
var currentCustomerAddress;
/**** actOnBehalfOfDeveloper ****/
function actOnBehalfOfDeveloper(EMailAddress, Password) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    expectEMailAddress('VoltCloud developer email address', EMailAddress);
                    expectPassword('VoltCloud developer password', Password);
                    return [4 /*yield*/, loginDeveloper(EMailAddress, Password)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**** actOnBehalfOfCustomer ****/
function actOnBehalfOfCustomer(EMailAddress, Password) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    expectEMailAddress('VoltCloud customer email address', EMailAddress);
                    expectPassword('VoltCloud customer password', Password);
                    assertApplicationFocus();
                    return [4 /*yield*/, loginCustomer(EMailAddress, Password)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**** ApplicationRecords ****/
function ApplicationRecords() {
    return __awaiter(this, void 0, void 0, function () {
        var Response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    assertDeveloperMandate();
                    return [4 /*yield*/, ResponseOf('private', 'GET', '{{dashboard_url}}/api/app')];
                case 1:
                    Response = _a.sent();
                    return [2 /*return*/, Response || []];
            }
        });
    });
}
/**** focusOnApplication - async for for the sake of systematics only ****/
function focusOnApplication(ApplicationIdOrURL) {
    return __awaiter(this, void 0, void 0, function () {
        var ApplicationRecordList, i, l, ApplicationRecord_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(activeDeveloperId != null)) return [3 /*break*/, 2];
                    expectNonEmptyString('VoltCloud application id', ApplicationIdOrURL);
                    currentApplicationId = undefined;
                    currentApplicationURL = undefined;
                    return [4 /*yield*/, ApplicationRecords()];
                case 1:
                    ApplicationRecordList = _a.sent();
                    for (i = 0, l = ApplicationRecordList.length; i < l; i++) {
                        ApplicationRecord_1 = ApplicationRecordList[i];
                        if (ApplicationRecord_1.id === ApplicationIdOrURL) {
                            currentApplicationId = ApplicationIdOrURL;
                            currentApplicationURL = ApplicationRecord_1.url;
                            return [2 /*return*/];
                        }
                    }
                    throwError('NoSuchApplication: no application with id ' + quoted(ApplicationIdOrURL) +
                        ' found for the currently focused developer');
                    return [3 /*break*/, 3];
                case 2:
                    currentApplicationId = undefined;
                    currentApplicationURL = ApplicationIdOrURL;
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**** focusOnApplicationCalled ****/
function focusOnApplicationCalled(ApplicationName) {
    return __awaiter(this, void 0, void 0, function () {
        var ApplicationRecordList, i, l, ApplicationRecord_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    expectApplicationName('VoltCloud application name', ApplicationName);
                    //  assertDeveloperMandate()             // will be done by "ApplicationRecords"
                    currentApplicationId = undefined;
                    currentApplicationURL = undefined;
                    return [4 /*yield*/, ApplicationRecords()];
                case 1:
                    ApplicationRecordList = _a.sent();
                    for (i = 0, l = ApplicationRecordList.length; i < l; i++) {
                        ApplicationRecord_2 = ApplicationRecordList[i];
                        if (ApplicationRecord_2.subdomain === ApplicationName) {
                            currentApplicationId = ApplicationRecord_2.id;
                            currentApplicationURL = ApplicationRecord_2.url;
                            return [2 /*return*/];
                        }
                    }
                    throwError('NoSuchApplication: no application called ' + quoted(ApplicationName) +
                        ' found for the currently focused developer');
                    return [2 /*return*/];
            }
        });
    });
}
/**** focusOnNewApplication ****/
function focusOnNewApplication() {
    return __awaiter(this, void 0, void 0, function () {
        var Response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    assertDeveloperMandate();
                    currentApplicationId = undefined;
                    currentApplicationURL = undefined;
                    return [4 /*yield*/, ResponseOf('private', 'POST', '{{dashboard_url}}/api/app', null, {})];
                case 1:
                    Response = _a.sent();
                    currentApplicationId = Response.id;
                    currentApplicationURL = Response.url;
                    return [2 /*return*/];
            }
        });
    });
}
/**** ApplicationRecord ****/
function ApplicationRecord() {
    return __awaiter(this, void 0, void 0, function () {
        var Response, Signal_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    assertDeveloperMandate();
                    assertApplicationFocus();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, ResponseOf('private', 'GET', '{{dashboard_url}}/api/app/{{application_id}}')];
                case 2:
                    Response = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    Signal_1 = _a.sent();
                    switch (Signal_1.HTTPStatus) {
                        case 404:
                            switch (Signal_1.message) {
                                case 'App not found.':
                                    throwError('NoSuchApplication: could not find the given application');
                            }
                            break;
                        case 422:
                            if (Signal_1.message === 'Could not decode scope.') {
                                throwError('InvalidArgument: invalid application id given');
                            }
                        default: throw Signal_1;
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, Response];
            }
        });
    });
}
/**** changeApplicationNameTo ****/
function changeApplicationNameTo(ApplicationName) {
    return __awaiter(this, void 0, void 0, function () {
        var Signal_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    expectApplicationName('VoltCloud application name', ApplicationName);
                    assertDeveloperMandate();
                    assertApplicationFocus();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, ResponseOf('private', 'PUT', '{{dashboard_url}}/api/app/{{application_id}}', null, {
                            subdomain: ApplicationName
                        })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    Signal_2 = _a.sent();
                    switch (Signal_2.HTTPStatus) {
                        case 404:
                            switch (Signal_2.message) {
                                case 'Could not route your request.':
                                case 'App not found.':
                                    throwError('NoSuchApplication: could not find the given application');
                            }
                            break;
                        case 409: throwError('ApplicationExists: an application with the given new name exists already');
                        case 422: switch (Signal_2.message) {
                            case 'Cannot change dashboard subdomain.':
                                throwError('NoSuchApplication: could not find the given application');
                            case 'Could not decode scope.':
                                throwError('InvalidArgument: invalid application id given');
                        }
                        default: throw Signal_2;
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**** updateApplicationRecordBy ****/
function updateApplicationRecordBy(Settings) {
    return __awaiter(this, void 0, void 0, function () {
        var Signal_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    expectPlainObject('VoltCloud application settings', Settings);
                    assertDeveloperMandate();
                    assertApplicationFocus();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, ResponseOf('private', 'PUT', '{{dashboard_url}}/api/app/{{application_id}}', null, Settings)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    Signal_3 = _a.sent();
                    switch (Signal_3.HTTPStatus) {
                        case 404:
                            switch (Signal_3.message) {
                                case 'Could not route your request.':
                                case 'App not found.':
                                    throwError('NoSuchApplication: could not find the given application');
                            }
                            break;
                        case 409: throwError('ApplicationExists: an application with the given new name exists already');
                        case 422: switch (Signal_3.message) {
                            case 'Cannot change dashboard subdomain.':
                                throwError('NoSuchApplication: could not find the given application');
                            case 'Could not decode scope.':
                                throwError('InvalidArgument: invalid application id given');
                        }
                        default: throw Signal_3;
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**** uploadToApplication ****/
function uploadToApplication(ZIPArchive) {
    return __awaiter(this, void 0, void 0, function () {
        var Signal_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    expectValue('ZIP archive', ZIPArchive);
                    if (!Buffer.isBuffer(ZIPArchive))
                        throwError('InvalidArgument: the given ZIP archive is no valid Node.js buffer');
                    assertDeveloperMandate();
                    assertApplicationFocus();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, ResponseOf('private', 'POST', '{{dashboard_url}}/api/app/{{application_id}}/version', {
                            application_id: currentApplicationId
                        }, ZIPArchive)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    Signal_4 = _a.sent();
                    switch (Signal_4.HTTPStatus) {
                        case 404:
                            switch (Signal_4.message) {
                                case 'Could not route your request.':
                                case 'App not found.':
                                    throwError('NoSuchApplication: could not find the given application');
                            }
                            break;
                        case 406: throwError('InternalError: ' + Signal_4.message);
                        case 422: switch (Signal_4.message) {
                            case 'Cannot change dashboard subdomain.':
                                throwError('NoSuchApplication: could not find the given application');
                            case 'Could not decode scope.':
                                throwError('InvalidArgument: invalid application id given');
                        }
                        default: throw Signal_4;
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**** deleteApplication ****/
function deleteApplication(ApplicationId) {
    return __awaiter(this, void 0, void 0, function () {
        var Signal_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    allowNonEmptyString('VoltCloud application id', ApplicationId);
                    assertDeveloperMandate();
                    if (ApplicationId == null) {
                        assertApplicationFocus();
                        ApplicationId = currentApplicationId;
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, ResponseOf('private', 'DELETE', '{{dashboard_url}}/api/app/{{application_id}}', {
                            application_id: ApplicationId
                        })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    Signal_5 = _a.sent();
                    switch (Signal_5.HTTPStatus) {
                        case 403: // if you try to delete the dashboard
                        case 404:
                            switch (Signal_5.message) {
                                case 'Could not route your request.':
                                case 'App not found.':
                                    return [2 /*return*/];
                            }
                            break;
                        case 409: throwError('ForbiddenOperation: ' + Signal_5.message);
                        case 422: switch (Signal_5.message) {
                            case 'Could not decode scope.':
                                throwError('InvalidArgument: invalid application id given');
                        }
                        default: throw Signal_5;
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**** ApplicationStorage ****/
function ApplicationStorage() {
    return __awaiter(this, void 0, void 0, function () {
        var Response, URL_1, Signal_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    assertDeveloperOrCustomerMandate();
                    assertApplicationFocus();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    URL_1 = (activeCustomerId == null ? '{{dashboard_url}}' : '{{application_url}}');
                    return [4 /*yield*/, ResponseOf('private', 'GET', URL_1 + '/api/storage/{{application_id}}')];
                case 2:
                    Response = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    Signal_6 = _a.sent();
                    switch (Signal_6.HTTPStatus) {
                        case 404:
                            switch (Signal_6.message) {
                                case 'Could not route your request.':
                                case 'App not found.':
                                    throwError('NoSuchApplication: could not find the given application');
                            }
                            break;
                        case 422: switch (Signal_6.message) {
                            case 'Could not decode scope.':
                                throwError('InvalidArgument: invalid application id given');
                        }
                        default: throw Signal_6;
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, Response || {}];
            }
        });
    });
}
/**** ApplicationStorageEntry ****/
function ApplicationStorageEntry(StorageKey) {
    return __awaiter(this, void 0, void 0, function () {
        var Response, URL_2, Signal_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    expectStorageKey('VoltCloud application storage key', StorageKey);
                    assertDeveloperOrCustomerMandate();
                    assertApplicationFocus();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    URL_2 = (activeCustomerId == null ? '{{dashboard_url}}' : '{{application_url}}');
                    return [4 /*yield*/, ResponseOf('private', 'GET', URL_2 + '/api/storage/{{application_id}}/key/{{application_storage_key}}', {
                            application_storage_key: StorageKey
                        })];
                case 2:
                    Response = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    Signal_7 = _a.sent();
                    switch (Signal_7.HTTPStatus) {
                        case 404:
                            switch (Signal_7.message) {
                                case 'Could not route your request.':
                                    throwError('NoSuchApplication: could not find the given application or storage key');
                                case 'App not found.':
                                    throwError('NoSuchApplication: could not find the given application');
                                case 'Key does not exist.':
                                    return [2 /*return*/, undefined];
                            }
                            break;
                        case 422: switch (Signal_7.message) {
                            case 'Could not decode scope.':
                                throwError('InvalidArgument: invalid application id given');
                            case 'The length of the key parameter must be <=255.':
                                throwError('InvalidArgument: the given storage key is too long');
                        }
                        default: throw Signal_7;
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, Response];
            }
        });
    });
}
/**** setApplicationStorageEntryTo ****/
function setApplicationStorageEntryTo(StorageKey, StorageValue) {
    return __awaiter(this, void 0, void 0, function () {
        var Signal_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    expectStorageKey('VoltCloud application storage key', StorageKey);
                    expectStorageValue('VoltCloud application storage value', StorageValue);
                    assertDeveloperMandate();
                    assertApplicationFocus();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, ResponseOf('private', 'PUT', '{{dashboard_url}}/api/storage/{{application_id}}/key/{{application_storage_key}}', {
                            application_storage_key: StorageKey
                        }, StorageValue)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    Signal_8 = _a.sent();
                    switch (Signal_8.HTTPStatus) {
                        case 404:
                            switch (Signal_8.message) {
                                case 'Could not route your request.':
                                case 'App not found.':
                                    throwError('NoSuchApplication: could not find the given application');
                            }
                            break;
                        case 413: throwError('InvalidArgument: the given storage value is too long');
                        case 422: switch (Signal_8.message) {
                            case 'Could not decode scope.':
                                throwError('InvalidArgument: invalid application id given');
                            case 'The length of the key parameter must be <=255.':
                                throwError('InvalidArgument: the given storage key is too long');
                        }
                        default: throw Signal_8;
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**** deleteApplicationStorageEntry ****/
function deleteApplicationStorageEntry(StorageKey) {
    return __awaiter(this, void 0, void 0, function () {
        var Signal_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    expectStorageKey('VoltCloud application storage key', StorageKey);
                    assertDeveloperMandate();
                    assertApplicationFocus();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, ResponseOf('private', 'DELETE', '{{dashboard_url}}/api/storage/{{application_id}}/key/{{application_storage_key}}', {
                            application_storage_key: StorageKey
                        })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    Signal_9 = _a.sent();
                    switch (Signal_9.HTTPStatus) {
                        case 404:
                            switch (Signal_9.message) {
                                case 'Could not route your request.':
                                    throwError('NoSuchApplication: could not find the given application or storage key');
                                case 'App not found.':
                                    throwError('NoSuchApplication: could not find the given application');
                                case 'Key does not exist.':
                                    return [2 /*return*/];
                            }
                            break;
                        case 422: switch (Signal_9.message) {
                            case 'Could not decode scope.':
                                throwError('InvalidArgument: invalid application id given');
                            case 'The length of the key parameter must be <=255.':
                                throwError('InvalidArgument: the given storage key is too long');
                        }
                        default: throw Signal_9;
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**** clearApplicationStorage ****/
function clearApplicationStorage() {
    return __awaiter(this, void 0, void 0, function () {
        var Signal_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    assertDeveloperMandate();
                    assertApplicationFocus();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, ResponseOf('private', 'DELETE', '{{dashboard_url}}/api/storage/{{application_id}}')];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    Signal_10 = _a.sent();
                    switch (Signal_10.HTTPStatus) {
                        case 404:
                            switch (Signal_10.message) {
                                case 'Could not route your request.':
                                case 'App not found.':
                                    throwError('NoSuchApplication: could not find the given application');
                            }
                            break;
                        case 422: switch (Signal_10.message) {
                            case 'Could not decode scope.':
                                throwError('InvalidArgument: invalid application id given');
                        }
                        default: throw Signal_10;
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**** CustomerRecords ****/
function CustomerRecords() {
    return __awaiter(this, void 0, void 0, function () {
        var Response, Signal_11;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    assertDeveloperMandate();
                    assertApplicationFocus();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, ResponseOf('private', 'GET', '{{dashboard_url}}/api/app/{{application_id}}/users')];
                case 2:
                    Response = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    Signal_11 = _a.sent();
                    switch (Signal_11.HTTPStatus) {
                        case 404:
                            switch (Signal_11.message) {
                                case 'Could not route your request.':
                                case 'App not found.':
                                    throwError('NoSuchApplication: could not find the given application');
                            }
                            break;
                        case 422: switch (Signal_11.message) {
                            case 'Could not decode scope.':
                                throwError('InvalidArgument: invalid application id given');
                        }
                        default: throw Signal_11;
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, Response || []];
            }
        });
    });
}
/**** focusOnCustomer - async for for the sake of systematics only ****/
function focusOnCustomer(CustomerId) {
    return __awaiter(this, void 0, void 0, function () {
        var CustomerRecordList, i, l, CustomerRecord_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    expectNonEmptyString('VoltCloud customer id', CustomerId);
                    assertDeveloperMandate();
                    assertApplicationFocus();
                    currentCustomerId = undefined;
                    currentCustomerAddress = undefined;
                    return [4 /*yield*/, CustomerRecords()];
                case 1:
                    CustomerRecordList = _a.sent();
                    for (i = 0, l = CustomerRecordList.length; i < l; i++) {
                        CustomerRecord_1 = CustomerRecordList[i];
                        if (CustomerRecord_1.id === CustomerId) {
                            currentCustomerId = CustomerId;
                            currentCustomerAddress = CustomerRecord_1.email;
                            return [2 /*return*/];
                        }
                    }
                    throwError('NoSuchCustomer: no customer with id ' + quoted(CustomerId) +
                        ' found for the currently focused application');
                    return [2 /*return*/];
            }
        });
    });
}
/**** focusOnCustomerWithAddress ****/
function focusOnCustomerWithAddress(EMailAddress) {
    return __awaiter(this, void 0, void 0, function () {
        var CustomerRecordList, i, l, CustomerRecord_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    expectEMailAddress('VoltCloud customer email address', EMailAddress);
                    assertDeveloperMandate();
                    assertApplicationFocus();
                    currentCustomerId = undefined;
                    currentCustomerAddress = undefined;
                    return [4 /*yield*/, CustomerRecords()];
                case 1:
                    CustomerRecordList = _a.sent();
                    for (i = 0, l = CustomerRecordList.length; i < l; i++) {
                        CustomerRecord_2 = CustomerRecordList[i];
                        if (CustomerRecord_2.email === EMailAddress) {
                            currentCustomerId = CustomerRecord_2.id;
                            currentCustomerAddress = EMailAddress;
                            return [2 /*return*/];
                        }
                    }
                    throwError('NoSuchCustomer: no customer with email address ' + quoted(EMailAddress) +
                        ' found for the currently focused application');
                    return [2 /*return*/];
            }
        });
    });
}
/**** focusOnNewCustomer ****/
function focusOnNewCustomer(EMailAddress, Password) {
    return __awaiter(this, void 0, void 0, function () {
        var Response, Signal_12;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    expectEMailAddress('VoltCloud customer email address', EMailAddress);
                    expectPassword('VoltCloud customer password', Password);
                    assertApplicationFocus();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, ResponseOf('public', 'POST', '{{application_url}}/api/auth/register', null, {
                            email: EMailAddress,
                            password: Password,
                            confirmation: Password,
                            scope: currentApplicationId
                        })];
                case 2:
                    Response = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    Signal_12 = _a.sent();
                    switch (Signal_12.HTTPStatus) {
                        case 404:
                            switch (Signal_12.message) {
                                case 'Could not route your request.':
                                case 'App not found.':
                                    throwError('NoSuchApplication: could not find the given application');
                            }
                            break;
                        case 422: switch (Signal_12.message) {
                            case 'Could not decode scope.':
                                throwError('InvalidArgument: invalid application id given');
                        }
                        default: throw Signal_12;
                    }
                    return [3 /*break*/, 4];
                case 4:
                    if ((Response != null) && ValueIsString(Response.id)) {
                        currentCustomerId = Response.id;
                        currentCustomerAddress = EMailAddress;
                    }
                    else {
                        throwError('InternalError: could not analyze response for registration request');
                    }
                    return [2 /*return*/];
            }
        });
    });
}
/**** resendConfirmationEMailToCustomer ****/
function resendConfirmationEMailToCustomer(EMailAddress) {
    return __awaiter(this, void 0, void 0, function () {
        var Signal_13;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    allowEMailAddress('VoltCloud customer email address', EMailAddress);
                    assertApplicationFocus();
                    if (EMailAddress == null) {
                        assertCustomerFocus();
                        EMailAddress = currentCustomerAddress;
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, ResponseOf('public', 'POST', '{{application_url}}/api/auth/resend', null, {
                            email: EMailAddress,
                            scope: currentApplicationId
                        })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    Signal_13 = _a.sent();
                    switch (Signal_13.HTTPStatus) {
                        case 422: switch (Signal_13.message) {
                            case 'Could not decode scope.':
                                throwError('InvalidArgument: invalid application id given');
                        }
                        default: throw Signal_13;
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**** confirmCustomerUsing ****/
function confirmCustomerUsing(Token) {
    return __awaiter(this, void 0, void 0, function () {
        var Signal_14;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    expectNonEmptyString('VoltCloud customer confirmation token', Token);
                    assertApplicationFocus();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, ResponseOf('public', 'POST', '{{application_url}}/api/auth/confirm', null, {
                            token: Token
                        })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    Signal_14 = _a.sent();
                    switch (Signal_14.HTTPStatus) {
                        case 401: throwError('BadToken: the given token can not be recognized');
                        default: throw Signal_14;
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**** startPasswordResetForCustomer ****/
function startPasswordResetForCustomer(EMailAddress) {
    return __awaiter(this, void 0, void 0, function () {
        var Signal_15;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    allowEMailAddress('VoltCloud customer email address', EMailAddress);
                    assertApplicationFocus();
                    if (EMailAddress == null) {
                        assertCustomerFocus();
                        EMailAddress = currentCustomerAddress;
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, ResponseOf('public', 'POST', '{{application_url}}/api/auth/forgot', null, {
                            email: EMailAddress,
                            scope: currentApplicationId
                        })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    Signal_15 = _a.sent();
                    switch (Signal_15.HTTPStatus) {
                        case 422: switch (Signal_15.message) {
                            case 'Could not decode scope.':
                                throwError('InvalidArgument: invalid application id given');
                        }
                        default: throw Signal_15;
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**** resetCustomerPasswordUsing ****/
function resetCustomerPasswordUsing(Token, Password) {
    return __awaiter(this, void 0, void 0, function () {
        var Signal_16;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    expectNonEmptyString('VoltCloud password reset token', Token);
                    expectPassword('VoltCloud customer password', Password);
                    assertApplicationFocus();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, ResponseOf('public', 'POST', '{{application_url}}/api/auth/reset', null, {
                            token: Token,
                            password: Password,
                            confirmation: Password
                        })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    Signal_16 = _a.sent();
                    switch (Signal_16.HTTPStatus) {
                        case 401: throwError('BadToken: the given token can not be recognized');
                        default: throw Signal_16;
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**** CustomerRecord ****/
function CustomerRecord(CustomerId) {
    return __awaiter(this, void 0, void 0, function () {
        var Response, URL, Signal_17;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    allowNonEmptyString('VoltCloud customer id', CustomerId);
                    assertDeveloperOrCustomerMandate();
                    assertApplicationFocus();
                    if (CustomerId == null) {
                        assertCustomerFocus();
                        CustomerId = currentCustomerId;
                    }
                    URL = (activeCustomerId == null ? '{{dashboard_url}}' : '{{application_url}}');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, ResponseOf('private', 'GET', URL + '/api/user/{{customer_id}}', {
                            customer_id: CustomerId
                        })];
                case 2:
                    Response = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    Signal_17 = _a.sent();
                    switch (Signal_17.HTTPStatus) {
                        case 422: switch (Signal_17.message) {
                            case 'Could not decode scope.':
                                throwError('InvalidArgument: invalid customer id given');
                        }
                        default: throw Signal_17;
                    }
                    return [3 /*break*/, 4];
                case 4:
                    if ((Response != null) && (Response.id === CustomerId)) {
                        //    currentCustomerId      = Response.id
                        currentCustomerAddress = Response.email; // might have changed
                        if (currentCustomerId === activeCustomerId) {
                            activeCustomerAddress = Response.email; // might have changed
                        }
                        return [2 /*return*/, Response];
                    }
                    else {
                        throwError('InternalError: could not analyze response for registration request');
                    }
                    return [2 /*return*/];
            }
        });
    });
}
/**** changeCustomerEMailAddressTo ****/
function changeCustomerEMailAddressTo(EMailAddress) {
    return __awaiter(this, void 0, void 0, function () {
        var Response, Signal_18;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    expectEMailAddress('VoltCloud customer email address', EMailAddress);
                    assertCustomerMandate();
                    assertApplicationFocus();
                    assertCustomerFocus();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, ResponseOf('private', 'PUT', '{{application_url}}/api/user/{{customer_id}}', null, {
                            email: EMailAddress
                        })];
                case 2:
                    Response = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    Signal_18 = _a.sent();
                    switch (Signal_18.HTTPStatus) {
                        case 404: throwError('NoSuchUser: the given customer does not exist');
                        case 409: throwError('UserExists: the given EMail address is already in use');
                        case 422: switch (Signal_18.message) {
                            case 'Could not decode scope.':
                                throwError('InvalidArgument: invalid customer id given');
                        }
                        default: throw Signal_18;
                    }
                    return [3 /*break*/, 4];
                case 4:
                    if ((Response != null) && (Response.id === currentCustomerId)) {
                        //    currentCustomerId      = Response.id
                        currentCustomerAddress = Response.email;
                        if (currentCustomerId === activeCustomerId) {
                            activeCustomerAddress = Response.email; // might have changed
                        }
                    }
                    else {
                        throwError('InternalError: could not analyze response for registration request');
                    }
                    return [2 /*return*/];
            }
        });
    });
}
/**** changeCustomerPasswordTo ****/
function changeCustomerPasswordTo(Password) {
    return __awaiter(this, void 0, void 0, function () {
        var Response, Signal_19;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    expectPassword('VoltCloud customer password', Password);
                    assertCustomerMandate();
                    assertApplicationFocus();
                    assertCustomerFocus();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, ResponseOf('private', 'PUT', '{{application_url}}/api/user/{{customer_id}}', null, {
                            password: {
                                old: activeCustomerPassword,
                                new: Password,
                                confirmation: Password
                            }
                        })];
                case 2:
                    Response = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    Signal_19 = _a.sent();
                    switch (Signal_19.HTTPStatus) {
                        case 403: throwError('ForbiddenOperation: wrong current password given');
                        case 404: throwError('NoSuchUser: the given customer does not exist');
                        case 422: switch (Signal_19.message) {
                            case 'Could not decode scope.':
                                throwError('InvalidArgument: invalid customer id given');
                        }
                        default: throw Signal_19;
                    }
                    return [3 /*break*/, 4];
                case 4:
                    if ((Response != null) && (Response.id === currentCustomerId)) {
                        if (currentCustomerId === activeCustomerId) {
                            activeCustomerPassword = Password;
                        }
                    }
                    else {
                        throwError('InternalError: could not analyze response for registration request');
                    }
                    return [2 /*return*/];
            }
        });
    });
}
/**** updateCustomerRecordBy ****/
function updateCustomerRecordBy(Settings) {
    return __awaiter(this, void 0, void 0, function () {
        var Response, Signal_20;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    expectPlainObject('VoltCloud customer settings', Settings);
                    assertCustomerMandate();
                    assertApplicationFocus();
                    assertCustomerFocus();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, ResponseOf('private', 'PUT', '{{application_url}}/api/user/{{customer_id}}', null, Settings)];
                case 2:
                    Response = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    Signal_20 = _a.sent();
                    switch (Signal_20.HTTPStatus) {
                        case 403: throwError('ForbiddenOperation: wrong current password given');
                        case 404: throwError('NoSuchUser: the given customer does not exist');
                        case 409: throwError('UserExists: the given EMail address is already in use');
                        case 422: switch (Signal_20.message) {
                            case 'Could not decode scope.':
                                throwError('InvalidArgument: invalid customer id given');
                        }
                        default: throw Signal_20;
                    }
                    return [3 /*break*/, 4];
                case 4:
                    if ((Response != null) && (Response.id === currentCustomerId)) {
                        //    currentCustomerId      = Response.id
                        currentCustomerAddress = Response.email; // might have changed
                        if (currentCustomerId === activeCustomerId) {
                            activeCustomerAddress = Response.email; // might have changed
                            if (Settings.password != null) {
                                activeCustomerPassword = Settings.password.new;
                            }
                        }
                    }
                    else {
                        throwError('InternalError: could not analyze response for registration request');
                    }
                    return [2 /*return*/];
            }
        });
    });
}
/**** deleteCustomer ****/
function deleteCustomer() {
    return __awaiter(this, void 0, void 0, function () {
        var URL_3, Signal_21;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    assertDeveloperOrCustomerMandate();
                    assertApplicationFocus();
                    assertCustomerFocus();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    URL_3 = (activeCustomerId == null ? '{{dashboard_url}}' : '{{application_url}}');
                    return [4 /*yield*/, ResponseOf('private', 'DELETE', URL_3 + '/api/user/{{customer_id}}')];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    Signal_21 = _a.sent();
                    switch (Signal_21.HTTPStatus) {
                        case 404:
                            switch (Signal_21.message) {
                                case 'User not found.': return [2 /*return*/];
                            }
                            break;
                        case 422: switch (Signal_21.message) {
                            case 'Could not decode scope.':
                                throwError('InvalidArgument: invalid user id given');
                        }
                        default: throw Signal_21;
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**** CustomerStorage ****/
function CustomerStorage() {
    return __awaiter(this, void 0, void 0, function () {
        var Response, URL_4, Signal_22;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    assertDeveloperOrCustomerMandate();
                    assertApplicationFocus();
                    assertCustomerFocus();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    URL_4 = (activeCustomerId == null ? '{{dashboard_url}}' : '{{application_url}}');
                    return [4 /*yield*/, ResponseOf('private', 'GET', URL_4 + '/api/storage/{{customer_id}}')];
                case 2:
                    Response = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    Signal_22 = _a.sent();
                    switch (Signal_22.HTTPStatus) {
                        case 404:
                            switch (Signal_22.message) {
                                case 'Could not route your request.':
                                case 'User not found.':
                                    throwError('NoSuchCustomer: could not find the given customer');
                            }
                            break;
                        case 422: switch (Signal_22.message) {
                            case 'Could not decode scope.':
                                throwError('InvalidArgument: invalid customer id given');
                        }
                        default: throw Signal_22;
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, Response || {}];
            }
        });
    });
}
/**** CustomerStorageEntry ****/
function CustomerStorageEntry(StorageKey) {
    return __awaiter(this, void 0, void 0, function () {
        var Response, URL_5, Signal_23;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    expectStorageKey('VoltCloud customer storage key', StorageKey);
                    assertDeveloperOrCustomerMandate();
                    assertApplicationFocus();
                    assertCustomerFocus();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    URL_5 = (activeCustomerId == null ? '{{dashboard_url}}' : '{{application_url}}');
                    return [4 /*yield*/, ResponseOf('private', 'GET', URL_5 + '/api/storage/{{customer_id}}/key/{{customer_storage_key}}', {
                            customer_storage_key: StorageKey
                        })];
                case 2:
                    Response = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    Signal_23 = _a.sent();
                    switch (Signal_23.HTTPStatus) {
                        case 404:
                            switch (Signal_23.message) {
                                case 'Could not route your request.':
                                    throwError('NoSuchCustomer: could not find the given customer or storage key');
                                case 'User not found.':
                                    throwError('NoSuchCustomer: could not find the given customer');
                                case 'Key does not exist.':
                                    return [2 /*return*/, undefined];
                            }
                            break;
                        case 422: switch (Signal_23.message) {
                            case 'Could not decode scope.':
                                throwError('InvalidArgument: invalid customer id given');
                            case 'The length of the key parameter must be <=255.':
                                throwError('InvalidArgument: the given storage key is too long');
                        }
                        default: throw Signal_23;
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, Response];
            }
        });
    });
}
/**** setCustomerStorageEntryTo ****/
function setCustomerStorageEntryTo(StorageKey, StorageValue) {
    return __awaiter(this, void 0, void 0, function () {
        var URL_6, Signal_24;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    expectStorageKey('VoltCloud customer storage key', StorageKey);
                    expectStorageValue('VoltCloud customer storage value', StorageValue);
                    assertDeveloperOrCustomerMandate();
                    assertApplicationFocus();
                    assertCustomerFocus();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    URL_6 = (activeCustomerId == null ? '{{dashboard_url}}' : '{{application_url}}');
                    return [4 /*yield*/, ResponseOf('private', 'PUT', URL_6 + '/api/storage/{{customer_id}}/key/{{customer_storage_key}}', {
                            customer_storage_key: StorageKey
                        }, StorageValue)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    Signal_24 = _a.sent();
                    switch (Signal_24.HTTPStatus) {
                        case 404:
                            switch (Signal_24.message) {
                                case 'Could not route your request.':
                                case 'User not found.':
                                    throwError('NoSuchCustomer: could not find the given customer');
                            }
                            break;
                        case 413: throwError('InvalidArgument: the given storage value is too long');
                        case 422: switch (Signal_24.message) {
                            case 'Could not decode scope.':
                                throwError('InvalidArgument: invalid customer id given');
                            case 'The length of the key parameter must be <=255.':
                                throwError('InvalidArgument: the given storage key is too long');
                        }
                        default: throw Signal_24;
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**** deleteCustomerStorageEntry ****/
function deleteCustomerStorageEntry(StorageKey) {
    return __awaiter(this, void 0, void 0, function () {
        var URL_7, Signal_25;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    expectStorageKey('VoltCloud customer storage key', StorageKey);
                    assertDeveloperOrCustomerMandate();
                    assertApplicationFocus();
                    assertCustomerFocus();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    URL_7 = (activeCustomerId == null ? '{{dashboard_url}}' : '{{application_url}}');
                    return [4 /*yield*/, ResponseOf('private', 'DELETE', URL_7 + '/api/storage/{{customer_id}}/key/{{customer_storage_key}}', {
                            customer_storage_key: StorageKey
                        })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    Signal_25 = _a.sent();
                    switch (Signal_25.HTTPStatus) {
                        case 404:
                            switch (Signal_25.message) {
                                case 'Could not route your request.':
                                case 'User not found.':
                                    throwError('NoSuchCustomer: could not find the given customer');
                            }
                            break;
                        case 422: switch (Signal_25.message) {
                            case 'Could not decode scope.':
                                throwError('InvalidArgument: invalid customer id given');
                            case 'The length of the key parameter must be <=255.':
                                throwError('InvalidArgument: the given storage key is too long');
                        }
                        default: throw Signal_25;
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**** clearCustomerStorage ****/
function clearCustomerStorage() {
    return __awaiter(this, void 0, void 0, function () {
        var URL_8, Signal_26;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    assertDeveloperOrCustomerMandate();
                    assertApplicationFocus();
                    assertCustomerFocus();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    URL_8 = (activeCustomerId == null ? '{{dashboard_url}}' : '{{application_url}}');
                    return [4 /*yield*/, ResponseOf('private', 'DELETE', URL_8 + '/api/storage/{{customer_id}}')];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    Signal_26 = _a.sent();
                    switch (Signal_26.HTTPStatus) {
                        case 404:
                            switch (Signal_26.message) {
                                case 'Could not route your request.':
                                case 'User not found.':
                                    throwError('NoSuchCustomer: could not find the given customer');
                            }
                            break;
                        case 422: switch (Signal_26.message) {
                            case 'Could not decode scope.':
                                throwError('InvalidArgument: invalid customer id given');
                        }
                        default: throw Signal_26;
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**** ValueIsPassword - a string following VoltCloud's password rules ****/
function ValueIsPassword(Value) {
    return (ValueIsString(Value) && (Value.length >= 8) &&
        /[0-9]/.test(Value) && /[^a-zA-Z0-9]/.test(Value) &&
        (Value.toLowerCase() !== Value));
}
/**** allow/expect[ed]Password ****/
var allowPassword = ValidatorForClassifier(ValueIsPassword, acceptNil, 'valid VoltCloud password'), allowedPassword = allowPassword;
var expectPassword = ValidatorForClassifier(ValueIsPassword, rejectNil, 'valid VoltCloud password'), expectedPassword = expectPassword;
/**** ValueIsApplicationName - a string suitable as a VoltCloud application name ****/
function ValueIsApplicationName(Value) {
    return (ValueIsString(Value) &&
        (Value.length >= 1) && (Value.length <= maxApplicationNameLength) &&
        ApplicationNamePattern.test(Value));
}
/**** allow/expect[ed]ApplicationName ****/
var allowApplicationName = ValidatorForClassifier(ValueIsApplicationName, acceptNil, 'valid VoltCloud application name'), allowedApplicationName = allowApplicationName;
var expectApplicationName = ValidatorForClassifier(ValueIsApplicationName, rejectNil, 'valid VoltCloud application name'), expectedApplicationName = expectApplicationName;
/**** ValueIsStorageKey - a string suitable as a VoltCloud storage key ****/
function ValueIsStorageKey(Value) {
    return ValueIsNonEmptyString(Value) && (Value.length <= maxStorageKeyLength);
}
/**** allow/expect[ed]StorageKey ****/
var allowStorageKey = ValidatorForClassifier(ValueIsStorageKey, acceptNil, 'suitable VoltCloud storage key'), allowedStorageKey = allowStorageKey;
var expectStorageKey = ValidatorForClassifier(ValueIsStorageKey, rejectNil, 'suitable VoltCloud storage key'), expectedStorageKey = expectStorageKey;
/**** ValueIsStorageValue - a string suitable as a VoltCloud storage value ****/
function ValueIsStorageValue(Value) {
    return ValueIsString(Value) && (Value.length <= maxStorageValueLength);
}
/**** allow/expect[ed]StorageValue ****/
var allowStorageValue = ValidatorForClassifier(ValueIsStorageValue, acceptNil, 'suitable VoltCloud storage value'), allowedStorageValue = allowStorageValue;
var expectStorageValue = ValidatorForClassifier(ValueIsStorageValue, rejectNil, 'suitable VoltCloud storage value'), expectedStorageValue = expectStorageValue;
/**** assertDeveloperMandate ****/
function assertDeveloperMandate() {
    if (activeDeveloperId == null)
        throwError('InvalidState: please mandate a specific VoltCloud developer first');
}
/**** assertCustomerMandate ****/
function assertCustomerMandate() {
    if (activeCustomerId == null)
        throwError('InvalidState: please mandate a specific VoltCloud customer first');
}
/**** assertDeveloperOrCustomerMandate ****/
function assertDeveloperOrCustomerMandate() {
    if ((activeDeveloperId == null) && (activeCustomerId == null))
        throwError('InvalidState: please mandate a specific VoltCloud developer or customer first');
}
/**** assertApplicationFocus ****/
function assertApplicationFocus() {
    if (currentApplicationURL == null)
        throwError('InvalidState: please focus on a specific VoltCloud application first');
}
/**** assertCustomerFocus ****/
function assertCustomerFocus() {
    if (currentCustomerId == null)
        throwError('InvalidState: please focus on a specific VoltCloud application customer first');
}
/**** loginDeveloper ****/
function loginDeveloper(EMailAddress, Password, firstAttempt) {
    if (firstAttempt === void 0) { firstAttempt = true; }
    return __awaiter(this, void 0, void 0, function () {
        var Response, Signal_27;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    activeDeveloperId = undefined; // avoid re-try after failure
                    activeDeveloperAddress = undefined; // dto.
                    activeDeveloperPassword = undefined; // dto.
                    activeCustomerId = undefined; // clear customer mandate
                    activeCustomerAddress = undefined; // dto.
                    activeCustomerPassword = undefined; // dto.
                    activeAccessToken = undefined;
                    currentCustomerId = undefined; // unfocus any customer
                    currentCustomerAddress = undefined; // dto.
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    activeDeveloperAddress = EMailAddress; // needed in case of login failure
                    activeDeveloperPassword = Password;
                    return [4 /*yield*/, ResponseOf('public', 'POST', '{{dashboard_url}}/api/auth/login', null, {
                            grant_type: 'password',
                            username: EMailAddress,
                            password: Password,
                            scope: DashboardId
                        }, firstAttempt)];
                case 2:
                    Response = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    Signal_27 = _a.sent();
                    switch (Signal_27.HTTPStatus) {
                        case 401: throwError('LoginFailed: developer could not be logged in');
                        default: throw Signal_27;
                    }
                    return [3 /*break*/, 4];
                case 4:
                    if ((Response != null) &&
                        (Response.token_type === 'bearer') && ValueIsString(Response.access_token) &&
                        ValueIsString(Response.user_id)) {
                        activeDeveloperId = Response.user_id;
                        activeAccessToken = Response.access_token;
                    }
                    else {
                        activeDeveloperAddress = undefined;
                        activeDeveloperPassword = undefined;
                        throwError('InternalError: could not analyze response for login request');
                    }
                    return [2 /*return*/];
            }
        });
    });
}
/**** loginCustomer ****/
function loginCustomer(EMailAddress, Password, firstAttempt) {
    if (firstAttempt === void 0) { firstAttempt = true; }
    return __awaiter(this, void 0, void 0, function () {
        var Response, Signal_28;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    activeCustomerId = undefined; // avoid re-try after failure
                    activeCustomerAddress = undefined; // dto.
                    activeCustomerPassword = undefined; // dto.
                    activeDeveloperId = undefined; // clear developer mandate
                    activeDeveloperAddress = undefined; // dto.
                    activeDeveloperPassword = undefined; // dto.
                    activeAccessToken = undefined;
                    currentCustomerId = undefined; // unfocus any customer
                    currentCustomerAddress = undefined; // dto.
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    activeCustomerAddress = EMailAddress; // needed in case of login failure
                    activeCustomerPassword = Password;
                    return [4 /*yield*/, ResponseOf('public', 'POST', '{{application_url}}/api/auth/login', null, {
                            grant_type: 'password',
                            username: EMailAddress,
                            password: Password,
                            scope: currentApplicationId
                        }, firstAttempt)];
                case 2:
                    Response = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    Signal_28 = _a.sent();
                    switch (Signal_28.HTTPStatus) {
                        case 401: throwError('LoginFailed: customer could not be logged in');
                        default: throw Signal_28;
                    }
                    return [3 /*break*/, 4];
                case 4:
                    if ((Response != null) &&
                        (Response.token_type === 'bearer') && ValueIsString(Response.access_token) &&
                        ValueIsString(Response.user_id)) {
                        activeCustomerId = Response.user_id;
                        activeAccessToken = Response.access_token;
                        currentCustomerId = Response.user_id; // auto-focus logged-in customer
                        currentCustomerAddress = EMailAddress; // dto.
                    }
                    else {
                        activeCustomerAddress = undefined;
                        activeCustomerPassword = undefined;
                        throwError('InternalError: could not analyze response for login request');
                    }
                    return [2 /*return*/];
            }
        });
    });
}
/**** ResponseOf ****/
function ResponseOf(Mode, Method, URL, Parameters, Data, firstAttempt) {
    if (firstAttempt === void 0) { firstAttempt = true; }
    return __awaiter(this, void 0, void 0, function () {
        var fullParameters, resolvedURL, RequestOptions, RequestBody, Boundary;
        return __generator(this, function (_a) {
            fullParameters = Object.assign({}, {
                dashboard_id: DashboardId,
                dashboard_url: DashboardURL,
                application_id: currentApplicationId,
                application_url: currentApplicationURL,
                customer_id: currentCustomerId,
            }, Parameters || {});
            resolvedURL = resolved(URL, fullParameters);
            if (Method === 'GET') {
                resolvedURL += ((resolvedURL.indexOf('?') < 0 ? '?' : '&') +
                    '_=' + Date.now());
            }
            RequestOptions = {
                method: Method,
                headers: {},
                timeout: Timeout
            };
            if (Mode === 'private') {
                // @ts-ignore we definitely want to index with a literal
                RequestOptions.headers['authorization'] = 'Bearer ' + activeAccessToken;
            }
            if (Data != null) {
                if (Buffer.isBuffer(Data)) {
                    Boundary = 'form-boundary';
                    RequestBody = Buffer.concat([
                        Buffer.from([
                            '--' + Boundary,
                            'Content-Disposition: form-data; name="file"; filename="index.zip"',
                            'Content-Type: application/zip'
                        ].join('\r\n') + '\r\n' + '\r\n', 'utf8'),
                        Data,
                        Buffer.from('\r\n' + '--' + Boundary + '--' + '\r\n', 'utf8')
                    ]);
                    // @ts-ignore we definitely want to index with a literal
                    RequestOptions.headers['content-type'] = 'multipart/form-data; boundary=' + Boundary;
                }
                else {
                    RequestBody = JSON.stringify(Data);
                    // @ts-ignore we definitely want to index with a literal
                    RequestOptions.headers['content-type'] = 'application/json';
                }
                // @ts-ignore we definitely want to index with a literal
                RequestOptions.headers['content-length'] = RequestBody.length;
            }
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var Request = https.request(resolvedURL, RequestOptions, function (Response) {
                        Response.on('error', function (Error) {
                            reject(namedError('RequestFailed: VoltCloud request failed (error code = ' +
                                quoted(Error.code) + ')'));
                        });
                        var ResponseData = '';
                        Response.on('data', function (Chunk) { return ResponseData += Chunk; });
                        Response.on('end', function () {
                            var StatusCode = Response.statusCode;
                            var ContentType = Response.headers['content-type'] || '';
                            switch (true) {
                                case (StatusCode === 204):
                                    return resolve(undefined);
                                case (StatusCode >= 200) && (StatusCode < 300):
                                    switch (true) {
                                        case ContentType.startsWith('application/json'):
                                            return resolve(JSON.parse(ResponseData));
                                        case (StatusCode === 201): // often w/ content-type "text/plain"
                                            return resolve(undefined);
                                        default:
                                            return reject(namedError('RequestFailed: unexpected response content type ' +
                                                quoted(ContentType || '(missing)'), {
                                                ContentType: ContentType,
                                                HTTPResponse: ResponseData
                                            }));
                                    }
                                case (StatusCode === 401):
                                    if (firstAttempt && (Mode !== 'public')) { // try to "refresh" the access token
                                        return (activeDeveloperAddress != null // also catches login failures
                                            ? loginDeveloper(activeDeveloperAddress, activeDeveloperPassword, false)
                                            : loginCustomer(activeCustomerAddress, activeCustomerPassword, false))
                                            .then(function () {
                                            ResponseOf(Mode, Method, URL, Parameters, Data, false)
                                                .then(function (Result) { return resolve(Result); })
                                                .catch(function (Signal) { return reject(Signal); });
                                        })
                                            .catch(function (Signal) { return reject(Signal); });
                                    }
                                    return reject(namedError('AuthorizationFailure: VoltCloud request could not be authorized', { HTTPStatus: StatusCode }));
                                default:
                                    if (ContentType.startsWith('application/json')) {
                                        try { // if given, try to use a VoltCloud error message
                                            var ErrorDetails = JSON.parse(ResponseData);
                                            if (ValueIsNonEmptyString(ErrorDetails.type) &&
                                                ValueIsNonEmptyString(ErrorDetails.message)) {
                                                if ((StatusCode === 422) &&
                                                    (ErrorDetails.type === 'ValidationError') &&
                                                    (ErrorDetails.validations != null)) {
                                                    return reject(ValidationError(ErrorDetails));
                                                }
                                                else {
                                                    return reject(namedError(ErrorDetails.type + ': ' + ErrorDetails.message, {
                                                        HTTPStatus: StatusCode, HTTPResponse: ResponseData
                                                    }));
                                                }
                                            }
                                        }
                                        catch (Signal) { /* otherwise create a generic error message */ }
                                    }
                                    return reject(namedError('RequestFailed: VoltCloud request failed', {
                                        HTTPStatus: StatusCode, HTTPResponse: ResponseData
                                    }));
                            }
                        });
                    });
                    Request.on('aborted', function () {
                        reject(namedError('RequestAborted: VoltCloud request has been aborted'));
                    });
                    Request.on('timeout', function () {
                        reject(namedError('RequestTimedout: VoltCloud request timed out'));
                    });
                    Request.on('error', function (Error) {
                        reject(namedError('RequestFailed: VoltCloud request failed before actually sending ' +
                            'data (error code = ' + quoted(Error.code) + ')'));
                    });
                    if (RequestBody != null) {
                        Request.write(RequestBody);
                    }
                    Request.end();
                })];
        });
    });
}
/**** resolved ****/
var PlaceholderPattern = /\{\{([a-z0-9_-]+)\}\}/gi;
function resolved(Text, VariableSet) {
    return Text.replace(PlaceholderPattern, function (_, VariableName) {
        if (VariableSet.hasOwnProperty(VariableName)) {
            return VariableSet[VariableName];
        }
        else {
            throwError('VariableNotFound: the given placeholder text refers to an ' +
                'undefined variable called ' + quoted(VariableName));
        }
    });
}
/**** namedError ****/
function namedError(Message, Details) {
    var Result;
    var Match = /^([$a-zA-Z][$a-zA-Z0-9]*):\s*(\S.+)\s*$/.exec(Message);
    if (Match == null) {
        Result = new Error(Message);
    }
    else {
        Result = new Error(Match[2]);
        Result.name = Match[1];
    }
    if (Details != null) {
        Object.assign(Result, Details); // not fool-proof!
    }
    return Result;
}
/**** ValidationError ****/
function ValidationError(Details) {
    function named422Error(Message) {
        return namedError(Message, { HTTPStatus: 422 });
    }
    if (ValueIsArray(Details.validations.body) &&
        (Details.validations.body[0] != null)) {
        var firstMessage = Details.validations.body[0].messages[0];
        switch (true) {
            case firstMessage.contains('email'):
                switch (Details.validations.body[0].property) {
                    case 'request.body.username':
                    case 'request.body.email': return named422Error('InvalidArgument: invalid EMail address given');
                }
                break;
            case firstMessage.contains('^([a-z0-9]|[a-z0-9][-a-z0-9]*[a-z0-9])$'):
                switch (Details.validations.body[0].property) {
                    case 'request.body.subdomain': return named422Error('InvalidArgument: invalid application name given');
                }
                break;
            case firstMessage.contains('does not meet minimum length of 1'):
                switch (Details.validations.body[0].property) {
                    case 'request.body.subdomain': return named422Error('MissingArgument: no application name given');
                    case 'request.body.confirmation_url': return named422Error('MissingArgument: no Customer Confirmation URL given');
                    case 'request.body.reset_url': return named422Error('MissingArgument: no Password Reset URL given');
                }
                break;
            case firstMessage.contains('does not meet maximum length of 63'):
                switch (Details.validations.body[0].property) {
                    case 'request.body.subdomain': return named422Error('InvalidArgument: the given application name is too long');
                    case 'request.body.confirmation_url': return named422Error('InvalidArgument: the given Customer Confirmation URL is too long');
                    case 'request.body.reset_url': return named422Error('InvalidArgument: the given Password Reset URL is too long');
                }
                break;
            case firstMessage.contains('additionalProperty'):
                return named422Error('InvalidArgument: unsupported property given');
            case firstMessage.contains('does not match pattern "[a-zA-Z0-9]{6,}"'):
                return named422Error('InvalidArgument: invalid Application Id given');
        }
    }
    if (ValueIsArray(Details.validations.password) &&
        (Details.validations.password[0] != null)) {
        return named422Error('InvalidArgument: ' + Details.validations.password[0]);
    }
    /**** fallback ****/
    return namedError('InternalError: ' + Details.message, Details);
}

export { ApplicationIdPattern, ApplicationNamePattern, ApplicationRecord, ApplicationRecords, ApplicationStorage, ApplicationStorageEntry, CustomerRecord, CustomerRecords, CustomerStorage, CustomerStorageEntry, ValueIsApplicationName, ValueIsPassword, ValueIsStorageKey, ValueIsStorageValue, actOnBehalfOfCustomer, actOnBehalfOfDeveloper, allowApplicationName, allowPassword, allowStorageKey, allowStorageValue, allowedApplicationName, allowedPassword, allowedStorageKey, allowedStorageValue, changeApplicationNameTo, changeCustomerEMailAddressTo, changeCustomerPasswordTo, clearApplicationStorage, clearCustomerStorage, confirmCustomerUsing, deleteApplication, deleteApplicationStorageEntry, deleteCustomer, deleteCustomerStorageEntry, expectApplicationName, expectPassword, expectStorageKey, expectStorageValue, expectedApplicationName, expectedPassword, expectedStorageKey, expectedStorageValue, focusOnApplication, focusOnApplicationCalled, focusOnCustomer, focusOnCustomerWithAddress, focusOnNewApplication, focusOnNewCustomer, maxApplicationNameLength, maxEMailAddressLength, maxNamePartLength, maxStorageKeyLength, maxStorageValueLength, resendConfirmationEMailToCustomer, resetCustomerPasswordUsing, setApplicationStorageEntryTo, setCustomerStorageEntryTo, startPasswordResetForCustomer, updateApplicationRecordBy, updateCustomerRecordBy, uploadToApplication };
//# sourceMappingURL=voltcloud-for-nodejs.esm.js.map
