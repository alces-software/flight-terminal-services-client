require 'test_helper'

class TokensMailerTest < ActionMailer::TestCase
  test "assigned" do
    mail = TokensMailer.assigned(token)
    assert_equal "You have been allocated a Flight Launch token", mail.subject
    assert_equal [token.assigned_to], mail.to
    assert_equal ["launch@alces-flight.com"], mail.from

    assert_equal read_fixture('assigned').join, mail.text_part.body.to_s
  end

  test "assigned_with_tenant_branding" do
    mail = TokensMailer.assigned(token_with_branding)
    assert_equal "You have been allocated a Flight Launch token", mail.subject
    assert_equal [token.assigned_to], mail.to
    assert_equal ["launch@alces-flight.com"], mail.from

    assert_equal read_fixture('assigned_with_tenant_branding').join, mail.text_part.body.to_s
  end
  private

  def token
    tenant.tokens.new(
      name: 'carelessly-spoil-coffee',
      credits: 20,
      assigned_to: 'me@example.com',
    )
  end

  def token_with_branding
    tenant_with_branding.tokens.new(
      name: 'carelessly-spoil-coffee',
      credits: 20,
      assigned_to: 'me@example.com',
    )
  end

  def tenant
    Tenant.find_by!(identifier: 'default')
  end

  def tenant_with_branding
    Tenant.find_by!(identifier: 'bigvuni')
  end
end
