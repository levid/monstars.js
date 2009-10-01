View.JSON = new Class({
   
    Extends: View,
    
    render: function() {
        return JSON.encode(this.data);
    }
    
});