from django import template
from django.utils.safestring import mark_safe

register = template.Library()


@register.filter
def generate_table_data(td_count=0):
    table_data = "<td>x</td>" * td_count + "<td></td>" * (10 - td_count)
    return mark_safe(table_data)
