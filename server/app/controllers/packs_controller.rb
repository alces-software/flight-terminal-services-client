#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class PacksController < ApplicationController
  class TokenNotAvailable < RuntimeError ; end
  class TokenNotFound < RuntimeError ; end
  class Unauthorized < RuntimeError ; end

  def top_up_from_token
    raise Unauthorized if current_user.nil?

    token = find_token
    raise TokenNotFound if token.nil?
    raise TokenNotAvailable unless token.available?

    User.transaction do
      current_user.compute_credits += token.credits
      current_user.save!
      token.mark_as(:used, current_user.email)
    end
  rescue
    render_build_exception($!)
    raise $! unless performed?
    return nil
  end

  private

  def find_token
    # XXX Is this what we want?  Should we search over any tenant at all?
    # XXX Can a user use credits added by any tenant on any other tenant?
    tenant = Tenant.find_by!(params.require(:tenant).permit(:identifier))
    tenant.tokens.find_by(params.require(:token).permit(:name))
  end

  def render_build_exception(exc)
    case exc
    when TokenNotAvailable
      render status: :unprocessable_entity, json: {
        status: 422,
        error: 'Unprocessable Entity',
        details: {
          token: ["token has already been used"],
        }
      }
    when TokenNotFound, ActiveRecord::RecordNotFound
      render status: :not_found, json: {
        status: 404,
        error: 'Not Found',
        details: {
          token: ["token not found"],
        }
      }
    when Unauthorized
      render status: :unauthorized, json: {
        status: 401,
        error: 'Unauthorized',
        # details: cluster_launch_config.errors.messages
      }
    end
  end
end
