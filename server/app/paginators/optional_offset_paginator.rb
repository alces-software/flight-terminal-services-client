# An optional offset paginator.
#
# This paginator differs from JSONAPI's OffsetPaginator in two respects.
#
# First, if a limit is not provided, no pagination is performed.
# OffsetPaginator, uses a default limit instead.
#
# Second, a limit of `0` is accepted,  in which case, 0 records will be
# returned.  Depending on the configuration of JSONAPI and/or the resource,
# the `meta` key of the response may include useful information, such as a
# count of the records.  This is analogous to a HEAD request.
#
class OptionalOffsetPaginator < OffsetPaginator

  def apply(relation, order_options)
    return relation if @limit.nil?
    super
  end

  def links_page_params(options = {})
    return {} if @limit.nil? || @limit == 0
    super
  end

  private

  def parse_pagination_params(params)
    if params.nil?
      @offset = 0
      @limit = nil
    elsif params.is_a?(ActionController::Parameters)
      validparams = params.permit(:offset, :limit)
      @offset = parse_pagination_param(:offset, validparams[:offset]) || 0
      @limit = parse_pagination_param(:limit, validparams[:limit])
    else
      fail JSONAPI::Exceptions::InvalidPageObject.new
    end
  rescue ActionController::UnpermittedParameters => e
    raise JSONAPI::Exceptions::PageParametersNotAllowed.new(e.params)
  end

  def parse_pagination_param(param_name, value)
    return nil if value.nil?
    Integer(value)
  rescue TypeError, ArgumentError
    fail JSONAPI::Exceptions::InvalidPageValue.new(
      param_name, value, "#{param_name.to_s.capitalize} is not an integer"
    )
  end

  def verify_pagination_params
    if @limit.present? && @limit < 0
      fail JSONAPI::Exceptions::InvalidPageValue.new(:limit, @limit)
    end
    if @offset < 0
      fail JSONAPI::Exceptions::InvalidPageValue.new(:offset, @offset)
    end
  end
end
