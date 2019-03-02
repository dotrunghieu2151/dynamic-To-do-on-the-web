$(document).ready(()=>{
     $.event.addProp('dataTransfer'); /* jquery is not compatible with drag and drop html5 data so we use this to make it compatible*/
    let dragItems = $('.content ul > li');
    let dragEl;
    let  deleteButtons = $('.deleteButton');
    const clone = $('.clone');
    const addButton = $('#addButton');
    const thingToAdd = $('#addTodo');
    const whereToAdd = $('.content ul');
    const modal = $('.modal-for-container');
    function startDrag(e){
        /*const itemIndex = $(this).index();
        e.dataTransfer.setData('text',itemIndex);  only works for ondrop and onstart for security reasons*/
        /* if (e.type === "touchstart") for touch events */ 
        dragEl = e.target;
        setTimeout( () => $(this).addClass('ghost')
        ,0);
    }
    function endDrag(e) {
        $(this).removeClass('ghost');
        updateOrder();
    }
    function draggingover(e) {
        e.preventDefault();
        if ( e.target && e.target != dragEl && e.target.nodeName == 'LI')  /* this is like a drop key
        normally we would use the dataTransfer, but we don't need drop here so we use this */
        { 
            const oldIndex = $(dragEl).index();
            const newIndex = $(this).index();
            $(dragEl).detach();
            if (oldIndex < newIndex) {
                $(e.target).after(dragEl);
            }
            else {
                $(e.target).before(dragEl);
            }
        }
    }
    function updateOrder() {
        dragItems = $('.content ul > li');
        $(dragItems).each(function(index){
            $(this).find(".order").html(index + '.');
            $(this).find("input").attr('id',index);
            $(this).find("label").attr('for',index);
        });
    }
    function deleteThing(){
        $(this).parent().remove();
        updateOrder();
    }
    function addThing(data) {
        $(clone).find('.to-do').html(data);
        $(clone).clone(true).appendTo(whereToAdd).removeClass('clone');
    }           
    function getData() {
        if (localStorage.getItem('user information') !== null) {
            const userInformation = JSON.parse(localStorage.getItem('user information'));
            $.each(userInformation, (index, value) => {
                 addThing(value);
            });
              updateOrder();  
        }
    }
    function saveData() {
        const DatatoSave = $(dragItems).filter("li:not(.clone)")
                                       .map((index,item) => {
                return $(item).find('.to-do').html();                               
        });
        localStorage.setItem('user information',JSON.stringify(DatatoSave));
    }
    $(deleteButtons).click(deleteThing);
    $(addButton).click(() => {
            addThing($(thingToAdd).val());
            updateOrder();  
            $(thingToAdd).val('');
    });
    $(document).keydown((e) => {
       if (e.keyCode == 13) {
           addThing($(thingToAdd).val());
           updateOrder();  
           $(thingToAdd).val('');
       } 
    });
    
    $(dragItems).on({
        dragstart: startDrag,
        dragover: draggingover,
        dragend: endDrag
        /* touchstart: startDrag,
        touchmove: draggingover,
        touchend: endDrag */
    });
    getData(); 
    $('#saveButton').click(saveData);
    $('#checkButton').click(()=>{
        const checkedDragItems = $('.content input:checked');
        if ( checkedDragItems.length == 0) {
            alert('You haven\'t checked anything');
        }
        else {
            const accomplishment = ((checkedDragItems.length/(dragItems.length-1))*100).toFixed(2);            
            $(checkedDragItems).parent().remove();
            updateOrder();
            if (accomplishment >= 50) {
                $('.modal-title').html('Congratulations !!(⌐■_■)!!');
                $('.modal-text').html('You have done ' + accomplishment + '% of the work. Well done!!');
            }
            else {
                $('.modal-title').html('Behind Schedule ಥ_ಥ');
                $('.modal-text').html('You have only done ' + accomplishment + '% of the work. Step up your game!!');
            }
            $(modal).css('display','block');
        }
    });
    $('.left-button').click(()=> {
        $(modal).css('display','none');
        window.location.reload();
    });
    $('.right-button').click(()=>{
        saveData();
        $(modal).css('display','none')
    });
});