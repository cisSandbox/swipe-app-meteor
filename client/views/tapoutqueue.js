/*

    Swipe screen hook-up

 */

Template.tapoutqueue.signedInStudents = function() {
    return Visits.find({timeOut: {$not: 'null'}});
};