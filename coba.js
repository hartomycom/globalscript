var gift_wrap_include = [
    'Discounted Sports Gift Box',
    'Sports Gift Box',
    'Sports Memorabilia Gift Box',
    'Baby Gift Box',
    'Themed Box',
    'Youth Gift Box',
    'Limited Edition Flash',
    'Old Sports Gift Box'
];
var gift_bag_changed = false;
var $window = $(window);

function build_cart(cart_items) {
    $('.cart_item_row_cloned').remove();
    $('#gift_bag_count').val(0);
    //cart_items = CartJS.cart.items;
    var cart_count = 0;
    $.each(cart_items, function(index, cart_item) {
        if (cart_item.variant_id == 45564247620) {
            $('#gift_bag_count').val(cart_item.quantity);
        } else {
            entryTemplate = $('.cart_item_row_table_exemplar').clone();
            entryTemplate.removeClass('cart_item_row_table_exemplar');
            entryTemplate.removeClass('d-none');
            var cartLineItem = entryTemplate;
            cartLineItem.find('.line_item_image').attr('src', cart_item.image);
            cartLineItem.find('.line_item_title').text(cart_item.product_title);
            cartLineItem.find('.line_item_link').attr('href', cart_item.url);
            cartLineItem.addClass('cart_item_row_cloned');
            cartLineItem.attr('rel', cart_item.variant_id);
            cart_index = index + 1;
            cartLineItem.attr('data-cart-row', cart_index);
            cartLineItem.attr('data-key', cart_item.key);
            cartLineItem.find('.line_item_cart_row').val(cart_index);
            var variant_title = '&nbsp;';
            if (cart_item.variant_title) {
                variant_title = cart_item.variant_title;
            }
            cartLineItem.find('.line_item_variant_title').html(variant_title);
            cartLineItem.find('.line_item_price').text(slate.Currency.formatMoney(cart_item.final_price, theme.moneyFormat));

            if (cart_item.line_level_discount_allocations.length >= 1) {
                var discount_copy = '';
                $.each(cart_item.line_level_discount_allocations, function(index, val) {
                    discount_copy += '<p class="discount mb-0 ">' + val.discount_application.title + '</p>';
                });
                cartLineItem.find('.discount_row_wrapper_col').html(discount_copy);
            } else {
                cartLineItem.find('.discount_row_wrapper').remove();
            }
            if (!gift_wrap_include.includes(cart_item.product_type) || product_tags[cart_item.id].includes('no_gift_wrap')) {
                cartLineItem.find('.gift_wrap_checkbox_wrapper').remove();
            } else {
                if (cart_item.properties._gift_bag == 'true') {
                    cartLineItem.find('.line_item_gift_wrap').attr('checked', 'checked');
                }
                cartLineItem.find('.line_item_gift_wrap').attr('name', 'gift_wrap_' + cart_index)
            }
            cartLineItem.find('.cart_qty_select').val(cart_item.quantity);
            cartLineItem.find('.line_item_qty').val(cart_item.quantity);
            cart_count = cart_count + cart_item.quantity;
            $('#cart_table_body').append(cartLineItem);
        }
    });
    $('#cart_count').text(cart_count);
    console.log('end_rebuilding_cart');
}

function update_sw_points() {
    var cartSubtotal = $('#cartSubtotal').text().replace('$', '');
    var potentialPoints = Math.floor(cartSubtotal * 1);

    if (potentialPoints > 0) {
        $('#sweet_tooth_cart_cta_container').show();
        $('#sweetToothPoints').text(potentialPoints);
    }
}



$(document).on('cart.requestComplete', function(event, cart) {
    update_sw_points();
    if (gift_bag_changed) {
        build_cart(CartJS.cart.items);
        gift_bag_changed = false
    }
    total_price_to_use = slate.Currency.formatMoney(cart.total_price, theme.moneyFormat);
    subtotal_price_to_use = cart.total_price;
    if (cart.total_discount > 0) {
        subtotal_price_to_use = cart.original_total_price;
        discount_to_use = '(' + slate.Currency.formatMoney(cart.total_discount, theme.moneyFormat) + ')';
        $('#cartDiscount').html(discount_to_use);
        $('li#discount_row').css('display', 'block');
    } else {
        $('li#discount_row').css('display', 'none');
    }
    subtotal_price_to_use = slate.Currency.formatMoney(subtotal_price_to_use, theme.moneyFormat);
    $('#cartSubtotal').text(subtotal_price_to_use);
    $('#cartTotal').text(total_price_to_use);
});


$(document).on('cart.ready', function(event, cart) {
    //console.log(cart.items);
    build_cart(cart.items);
    update_sw_points();



    function add_gift_bag(line_item_number, qty) {
        CartJS.updateItem(line_item_number, qty, {
            '_gift_bag': "true"
        }, {
            "success": function(data, textStatus, jqXHR) {
                CartJS.addItem(45564247620, qty, {}, {
                    "success": function(data, textStatus, jqXHR) {
                        //console.log(data.quantity);
                        //$('#gift_bag_count').val(data.quantity)
                        //$('#gift_bag_count').attr('value', data.quantity);
                        //build_cart(cart.items);
                        gift_bag_changed = true;
                    },
                    "error": function(jqXHR, textStatus, errorThrown) {
                        alert('Error1: ' + errorThrown + '!');
                    }
                });

            },
            "error": function(jqXHR, textStatus, errorThrown) {
                alert('Error2: ' + errorThrown + '!');
            }
        });
    }


    function remove_gift_bag(line_item_number, qty) {
        CartJS.updateItem(line_item_number, qty, {
            '_gift_bag': "false"
        }, {
            "success": function(data, textStatus, jqXHR) {
                var new_gb_qty = $('#gift_bag_count').val() - qty;
                CartJS.updateItemById(45564247620, new_gb_qty, {}, {
                    "success": function(data, textStatus, jqXHR) {
                        gift_bag_changed = true;
                    },
                    "error": function(jqXHR, textStatus, errorThrown) {
                        alert('Error3: ' + errorThrown + '!');
                    }
                });
            },
            "error": function(jqXHR, textStatus, errorThrown) {
                console.log('Error4: ' + errorThrown + '!');
            }
        });
    }



    //start of shows/hides cart note messages
    $('#cart_wrapper').on('click', '.is-this-a-gift', function(e) {
        var val = $(e.target).val();
        if (val == 'yes') {
            $('#gift_note_details').show();
        } else {
            $('#gift_note_details').hide();
        }
    });
    //end of shows/hides cart note messages

    //start of note character count
    var maxchars = 250;
    $('#gift_note_textarea').keyup(function() {
        var tlength = $(this).val().length;
        $(this).val($(this).val().substring(0, maxchars));
        var tlength = $(this).val().length;
        remain = maxchars - parseInt(tlength);
        $('#remain').text(remain);
    });
    //end of note character count

    $('#cart_row_wrapper').on('change', '.line_item_gift_wrap', function() {
        var cart_row = $(this).closest('.cart_item_row_table');
        var working_line_item = cart_row.data('cart-row');
        var working_variant_id = cart_row.attr('rel');
        var curr_qty = cart_row.find('.cart_qty_select').find('option:selected').val();
        var outputJSON = JSON.stringify($('.cart_line_item').serializeArray());
        $('#note_output').val(outputJSON);
        if ($(this).is(':checked')) {
            add_gift_bag(working_line_item, curr_qty);
        } else {
            remove_gift_bag(working_line_item, curr_qty);
        }
    })

    $('#cart_row_wrapper').on('click', '.remove_item_from_cart_table', function(e) {
        e.preventDefault();
        var gb = false;
        var cart_row = $(this).closest('.cart_item_row_table');
        var working_line_item = cart_row.data('cart-row');
        if (cart_row.find('.line_item_gift_wrap').is(':checked')) {
            var qty = cart_row.find('.cart_qty_select').find('option:selected').val();
            gb = true;
        }

        CartJS.removeItem(working_line_item, {
            "success": function(data, textStatus, jqXHR) {
                if (gb == true) {
                    var new_gb_qty = $('#gift_bag_count').val() - qty;
                    CartJS.updateItemById(45564247620, new_gb_qty, {}, {
                        "success": function(data, textStatus, jqXHR) {
                            gift_bag_changed = true;
                        },
                        "error": function(jqXHR, textStatus, errorThrown) {
                            alert('Error3: ' + errorThrown + '!');
                        }
                    });
                } else {
                    build_cart(data.items);
                }
            },
            "error": function(jqXHR, textStatus, errorThrown) {
                alert('Error8: ' + errorThrown + '!');
            }
        });
    })

    $('#cart_row_wrapper').on('change', '.cart_qty_select', function() {
        var gb = false;
        var cart_row = $(this).closest('.cart_item_row_table');
        var working_line_item = cart_row.data('cart-row');
        var working_variant_id = cart_row.attr('rel');
        var line_item_key = cart_row.data('key');
        var prev_qty = cart_row.find('.line_item_qty').val();
        var new_qty = $(this).find('option:selected').val();
        if (cart_row.find('.line_item_gift_wrap').is(':checked')) {
            gb = true;
        }
        CartJS.updateItem(working_line_item, new_qty, {}, {
            "success": function(data, textStatus, jqXHR) {
                if (gb) {
                    if (new_qty == 0) {
                        var updated_qty = 0
                    } else {
                        var cart_updated_index = data.items.findIndex(val => val.key == line_item_key);
                        var working_cart_item = data.items[cart_updated_index];
                        var updated_qty = working_cart_item.quantity;
                    }
                    if (updated_qty == 0) {
                        var new_gb_qty = $('#gift_bag_count').val();
                        var qty_change = 0 - parseInt(prev_qty);
                        var new_gb_qty = parseInt(new_gb_qty) + qty_change;
                        CartJS.updateItemById(45564247620, new_gb_qty, {}, {
                            "success": function(data, textStatus, jqXHR) {
                                gift_bag_changed = true;
                            },
                            "error": function(jqXHR, textStatus, errorThrown) {
                                alert('Error3: ' + errorThrown + '!');
                            }
                        });
                    } else if (updated_qty != prev_qty) {
                        var new_gb_qty = $('#gift_bag_count').val();
                        var qty_change = updated_qty - parseInt(prev_qty);
                        var new_gb_qty = parseInt(new_gb_qty) + qty_change;
                        CartJS.updateItemById(45564247620, new_gb_qty, {}, {
                            "success": function(data, textStatus, jqXHR) {
                                gift_bag_changed = true;
                            },
                            "error": function(jqXHR, textStatus, errorThrown) {
                                alert('Error3: ' + errorThrown + '!');
                            }
                        });
                    } else {
                        build_cart(data.items);
                    }
                } else {
                    build_cart(data.items);
                }
            },
            "error": function(jqXHR, textStatus, errorThrown) {
                console.log('Error6: ' + errorThrown + '!');
            }
        })
    })
});

$window.on('scroll', function() {
    var window_top_position = $window.scrollTop();
    if (window_top_position <= 10) {
        $('#continue_to_checkout_row').addClass('closed');
    } else {
        $('#continue_to_checkout_row').removeClass('closed');
    }
});
