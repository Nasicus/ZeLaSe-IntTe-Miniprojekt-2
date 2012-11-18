#region Header
// ------------------------ Licence / Copyright ------------------------
// 
// ScrumTable for Microsoft Team Foundation Server 2010
// Copyright © HSR - Hochschule für Technik Rapperswil 2010
// All Rights Reserved
// 
// Author:
//  Michael Gfeller Silvan Gehrig Patrick Boos
// 
// ---------------------------------------------------------------------
#endregion

using System.Diagnostics;
using System;

namespace JSTestat.Service.Util
{
    #region Usings

    

    #endregion

    /// <summary>
    /// Contains PreCondition check features, which allows to throw exceptions
    /// or work with assertions.
    /// </summary>
    [DebuggerNonUserCode]
    [DebuggerStepThrough]
    public static class PreCondition
    {
        #region Declarations
        //--------------------------------------------------------------------
        // Declarations
        //--------------------------------------------------------------------


        #endregion

        #region Properties
        //--------------------------------------------------------------------
        // Properties
        //--------------------------------------------------------------------

        #endregion

        #region Constructors / Destructor
        //--------------------------------------------------------------------
        // Constructors / Destructor
        //--------------------------------------------------------------------

        #endregion

        #region Methods
        //--------------------------------------------------------------------
        // Methods
        //--------------------------------------------------------------------


        /// <summary>
        /// Asserts that the given string is not null and contains at least
        /// 1 character. Otherwise an exception (or assertion) will be
        /// thrown.
        /// </summary>
        /// <param name="arg">Specifies the argument to check.</param>
        /// <param name="name">Specifies the name of the argument to check.</param>
        [DebuggerHidden]
        public static void AssertNotNullOrEmpty(string arg, string name)
        {
            AssertTrue(!string.IsNullOrEmpty(arg), () => new ArgumentException(name));
        }

        /// <summary>
        /// Asserts that the given object is not null. Otherwise an
        /// exception will be thrown.
        /// </summary>
        /// <param name="arg">Specifies the argument to check.</param>
        /// <param name="name">Specifies the name of the argument to check.</param>
        [DebuggerHidden]
        public static void AssertNotNull(object arg, string name)
        {
            AssertTrue(arg != null, () => new ArgumentNullException(name));
        }

        /// <summary>
        /// Asserts that the given condition is true. Otherwise an
        /// exception will be thrown.
        /// </summary>
        /// <param name="condition">Condition which should be true.</param>
        /// <param name="message">Specifies the argument exception message to throw.</param>
        [DebuggerHidden]
        public static void AssertTrue(bool condition, string message)
        {
            AssertTrue(condition, () => new ArgumentException(message));
        }

        /// <summary>
        /// Asserts that the given condition is true. Otherwise an
        /// exception will be thrown.
        /// </summary>
        /// <param name="condition">Condition which should be true.</param>
        /// <param name="name">Specifies the name of the argument to check.</param>
        /// <param name="message">Specifies the argument exception message to throw.</param>
        [DebuggerHidden]
        public static void AssertTrue(bool condition, string message, string name)
        {
            AssertTrue(condition, () => new ArgumentException(message ?? name ));
        }

        /// <summary>
        /// Asserts that the given condition is true. Otherwise the
        /// given exception will be thrown.
        /// </summary>
        /// <param name="condition">Condition which should be true.</param>
        /// <param name="exception">Specifies the exception to throw.</param>
        [DebuggerHidden]
        public static void AssertTrue(bool condition, Exception exception)
        {
            AssertTrue(condition, () => exception);
        }

        [DebuggerHidden]
        private static void AssertTrue(bool condition, Func<Exception> toEvaluateException)
        {
            if (!condition)
            {
                Exception exception = toEvaluateException();
                throw exception;
            }
        }

        #endregion
    }
}
