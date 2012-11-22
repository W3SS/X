
var F = {
    number_only : function(e) {
        var k = (e.which) ? e.which : e.keyCode;
        if (k !== 8 && (k < 48 || k > 57) && (k < 96 || k > 105))
            return stopDef(e);
        return true;
    },
    phone : function(e) {
        var k = (e.which) ? e.which : e.keyCode;
        if (k != 8 && (k < 48 || k > 57) && (k < 96 || k > 105))
            return stopDef(e);
        var vl = this.value;
        if ((vl.length == 3 || vl.length == 7) && k != 8) {
            this.value = vl + " ";
        }
        if (vl.length >= 11 && k != 8)
            return stopDef(e);
        return true;
    }
};