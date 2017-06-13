#==============================================================================
# Copyright (C) 2017 Stephen F. Norledge and Alces Flight Ltd.
#
# This file is part of Alces Launch.
#
# All rights reserved, see LICENSE.txt.
#==============================================================================

class TokensMailer < ApplicationMailer

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.tokens_mailer.assigned.subject
  #
  def assigned(token)
    @token = token
    @tenant = token.tenant

    mail to: token.assigned_to,
      subject: "You have been allocated a Flight Launch token"
  end
end
