View.JSON = new Class({
   
    Extends: View,
    
    $class: 'View.JSON',
    
    render: function() {
        return JSON.encode(this.data);
    }
    
});