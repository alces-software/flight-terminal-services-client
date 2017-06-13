# Preview all emails at http://localhost:3000/rails/mailers/tokens_mailer
class TokensMailerPreview < ActionMailer::Preview

  # Preview this email at http://localhost:3000/rails/mailers/tokens_mailer/assigned
  def assigned
    TokensMailer.assigned(token)
  end

  # Preview this email at http://localhost:3000/rails/mailers/tokens_mailer/assigned
  def assigned_with_branding
    TokensMailer.assigned(token_with_branding)
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
